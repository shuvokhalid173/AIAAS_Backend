const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require('../configs/env.config');
const mysqlDb = require('../infrastructure/mysql.db');
const redisClient = require('../infrastructure/redis');


async function isAuthenticated(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "UNAUTHORIZED",
                message: "Access token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, jwtConfig.secret);

        // Attach auth context
        req.auth = {
            userId: decoded.sub,
            orgId: decoded.oid ? decoded.oid : null,
            sessionId: decoded.sid,
            credential_version: decoded.ver
        };

        const redisKey = `session:${decoded.sid}`;
        const redisValue = await redisClient.get(redisKey);
        if (redisValue === "not revoked") {
          return next();
        }
            
        // check if the session is valid (select 1 from auth_sessions where id = ? and is_revoked = 0)
        const [sessions] = await mysqlDb.query(
            `SELECT * FROM auth_sessions WHERE id = ? AND is_revoked = 0 LIMIT 1;`,
            [decoded.sid]
        );

        if (sessions.length === 0) {
            return res.status(401).json({
                error: "UNAUTHORIZED",
                message: "Invalid or expired session"
            });
        }

        const session = sessions[0];

        // check if the session is expired
        if (session.expires_at && new Date(session.expires_at) < new Date()) {
            return res.status(401).json({
                error: "UNAUTHORIZED",
                message: "Session expired"
            });
        }
        // save session status to redis for 2 minutes
        await redisClient.setex(`session:${decoded.sid}`, 120, "not revoked");

        return next();
    } catch (err) {
        return res.status(401).json({
            error: "UNAUTHORIZED",
            message: "Invalid or expired token"
        });
    } 
}

module.exports = isAuthenticated;