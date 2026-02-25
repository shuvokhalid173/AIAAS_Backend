const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const mysqlDb = require('../infrastructure/mysql.db');
const InputValidator = require('../utils/input.validator');
const { Queue } = require('../infrastructure/queue');
const redisClient = require('../infrastructure/redis.db');
const { bcrypt: bcryptConfig, auth_rules, jwt: jwtConfig } = require('../configs/env.config');

const FAKE_HASH = bcryptConfig.fakeHash || '$2b$12$C6UzMDM.H6dfI/f/IKcEeO6V6bJ3u6KDAdAm8YGtSNYGGyRyvE4sW';

const emailQueue = new Queue('emailQueue', {
    connection: redisClient,
});

async function register(email, password, phone) {
    const connection = await mysqlDb.getConnection();
    await connection.beginTransaction();

    try {
        new InputValidator('Email', email).required().isEmail();
        new InputValidator('Password', password).required().isValidPassword();

        const passwordHash = await bcrypt.hash(
            password,
            bcryptConfig.saltRounds || 10
        );

        const userId = crypto.randomUUID();

        const [userResult] = await connection.query(
            `INSERT INTO auth_users (id, email, phone, status, is_email_verified)
             VALUES (?, ?, ?, 'pending', 0)`,
            [userId, email, phone]
        );

        await connection.query(
            `INSERT INTO auth_credentials (user_id, secret_hash, type, version, is_active)
             VALUES (?, ?, 'password', 1, 1)`,
            [userId, passwordHash]
        );

        await connection.commit();

        await emailQueue.add('emailVerification', { userId, email });

        return { userId, email };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

async function login(email, password, ip, userAgent) {

    new InputValidator('Email', email).required().isEmail();
    new InputValidator('Password', password).required();

    const [users] = await mysqlDb.query(
        `SELECT * FROM auth_users WHERE email = ?`,
        [email]
    );

    const user = users[0];

    const [credentials] = await mysqlDb.query(
        `SELECT * FROM auth_credentials
         WHERE user_id = ? AND type = 'password' AND is_active = 1`,
        [user?.id || 0]
    );

    const credential = credentials[0];
    const hashToCompare = credential?.secret_hash || FAKE_HASH;

    const isMatch = await bcrypt.compare(password, hashToCompare);

    if (!user || !credential || !isMatch) {
        if (user) {
            const failedAttempts = user.failed_attempts + 1;
            let lockUntil = null;

            if (failedAttempts >= auth_rules.max_failed_attempts) {
                const lockTime = new Date();
                lockTime.setMinutes(lockTime.getMinutes() + auth_rules.lock_time_minutes);
                lockUntil = lockTime;
            }

            await mysqlDb.query(
                `UPDATE auth_users 
                 SET failed_attempts = ?, lock_until = ?
                 WHERE id = ?`,
                [failedAttempts, lockUntil, user.id]
            );
        }
        throw new Error('Invalid credentials');
    }

    if (user.lock_until && new Date(user.lock_until) > new Date()) {
        throw new Error('Account locked');
    }

    // reset failed attempts
    await mysqlDb.query(
        `UPDATE auth_users SET failed_attempts = 0, lock_until = ? WHERE id = ?`,
        [null, user.id]
    );

    const tokens = await createSession(user, credential.version, ip, userAgent, null);
    return tokens;
}

async function createSession(user, credential_version, ip, userAgent, orgId = null) {
    // create session
    const sessionId = crypto.randomUUID();

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + auth_rules.refresh_token_expiration_days);

    await mysqlDb.query(
        `INSERT INTO auth_sessions
         (id, user_id, refresh_token_hash, expires_at, ip_address, user_agent, credential_version)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [sessionId, user.id, refreshTokenHash, refreshExpiry, ip, userAgent, credential_version]
    );

    const accessToken = jwt.sign(
        {
            sub: user.id,
            sid: sessionId,
            ver: credential_version,
            iss: "auth-service",
            aud: "api",
            oid: orgId
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiration }
    );

    return {
        accessToken,
        refreshToken: sessionId + ':' + refreshToken
    };
}

async function refresh(refreshTokenPayload, orgId = null) {
    const [sessionId, refreshToken] = refreshTokenPayload.split(':');

    if (!sessionId || !refreshTokenPayload) {
        throw new Error('Invalid refresh token');
    }

    const [sessions] = await mysqlDb.query(
        `SELECT * FROM auth_sessions 
         WHERE is_revoked = 0 AND id = ?`,
        [sessionId]
    );

    if (sessions.length === 0) {
        throw new Error('Invalid refresh token');
    }

    const matchedSession = sessions[0];

    const isMatch = await bcrypt.compare(refreshToken, matchedSession.refresh_token_hash);
    if (!isMatch) {
        throw new Error('Invalid refresh token');
    }

    if (new Date(matchedSession.expires_at) < new Date()) {
        throw new Error('Refresh expired');
    }

    // rotate
    const newRefreshToken = crypto.randomBytes(64).toString('hex');
    const newRefreshHash = await bcrypt.hash(newRefreshToken, 10);

    await mysqlDb.query(
        `UPDATE auth_sessions 
         SET refresh_token_hash = ? 
         WHERE id = ?`,
        [newRefreshHash, matchedSession.id]
    );

    // normal refresh flow for user who already selected an organization
    if (!orgId) {
        orgId = matchedSession.auth_org_id || null;
    }

    const accessToken = jwt.sign(
        {
            sub: matchedSession.user_id,
            sid: matchedSession.id,
            iss: "auth-service",
            aud: "api",
            oid: orgId,
            ver: matchedSession.credential_version
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiration }
    );

    return {
        accessToken,
        refreshToken: matchedSession.id + ':' + newRefreshToken
    };
}

async function logout(sessionId) {
    try {
        // check if session exists
        const [sessions] = await mysqlDb.query(
            `SELECT * FROM auth_sessions 
             WHERE id = ? AND is_revoked = 0`,
            [sessionId]
        );

        if (sessions.length === 0) {
            throw new Error('Session not found or already revoked');
        }

        await mysqlDb.query(
            `UPDATE auth_sessions 
            SET is_revoked = 1 
            WHERE id = ?`,
            [sessionId]
        );

        await redisClient.del(`session:${sessionId}`);
    } catch (error) {
        throw "Logout failed";
    }
}

// update user's status based on email verification
async function updateUserAuthStatus(user, isEmailVerified = false) {
    const { userId, email } = user;
    try {
        if (isEmailVerified) {
            await mysqlDb.query('UPDATE auth_users SET status = ?, is_email_verified = ? WHERE id = ?', ['active', 1, userId]);

            // add a job to the email queue for sending welcome email
            await emailQueue.add('sendWelcomeEmail', { userId, email });
        } 
    } catch (error) {
        throw error;
    }
}

module.exports = {
    register,
    login,
    updateUserAuthStatus,
    refresh,
    logout,
    createSession
};
