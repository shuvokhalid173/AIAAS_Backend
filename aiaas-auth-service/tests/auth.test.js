const test = require('node:test');
const assert = require('node:assert');
const { startTestServer, mockMysql, mockRedis } = require('./test-helper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

test('Auth Route Tests', async (t) => {
    const { port, close } = await startTestServer();
    const baseUrl = `http://localhost:${port}/api/auth`;

    await t.test('POST /register - success', async () => {
        const res = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'Password123!',
                phone: '1234567890'
            })
        });

        const data = await res.json();
        assert.strictEqual(res.status, 201);
        assert.strictEqual(data.message, 'User registered successfully');
        assert.ok(data.user.userId);
    });

    await t.test('POST /login - success', async () => {
        const mockUser = { id: 'user-id', email: 'test@example.com', failed_attempts: 0 };
        const mockCredential = { secret_hash: await bcrypt.hash('Password123!', 10), version: 1 };

        mockMysql.query.mock.mockImplementation(async (sql) => {
            if (sql.includes('FROM auth_users')) return [[mockUser]];
            if (sql.includes('FROM auth_credentials')) return [[mockCredential]];
            return [[]];
        });

        const res = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'Password123!'
            })
        });

        const data = await res.json();
        assert.strictEqual(res.status, 200);
        assert.strictEqual(data.message, 'Login successful');
        assert.ok(data.token.accessToken);
        assert.ok(data.token.refreshToken);
    });

    await t.test('POST /refresh - success', async () => {
        const sessionId = 'session-id';
        const refreshTokenPayload = `${sessionId}:token`;
        const mockSession = { 
            id: sessionId, 
            user_id: 'user-id', 
            refresh_token_hash: await bcrypt.hash('token', 10),
            expires_at: new Date(Date.now() + 86400000).toISOString(),
            credential_version: 1
        };

        mockMysql.query.mock.mockImplementation(async (sql) => {
            if (sql.includes('FROM auth_sessions')) return [[mockSession]];
            return [[]];
        });

        const res = await fetch(`${baseUrl}/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: refreshTokenPayload })
        });

        const data = await res.json();
        assert.strictEqual(res.status, 200);
        assert.strictEqual(data.message, 'Token refreshed successfully');
        assert.ok(data.token.accessToken);
    });

    await t.test('POST /logout - success', async () => {
        const token = jwt.sign({ sub: 'user-id', sid: 'session-id', ver: 1 }, 'test-secret');
        
        mockRedis.get.mock.mockImplementation(async () => 'not revoked');
        mockMysql.query.mock.mockImplementation(async (sql) => {
            if (sql.includes('FROM auth_sessions')) return [[{ id: 'session-id' }]];
            return [[]];
        });

        const res = await fetch(`${baseUrl}/logout`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ sessionId: 'session-id' })
        });

        const data = await res.json();
        assert.strictEqual(res.status, 200);
        assert.strictEqual(data.message, 'Logout successful');
    });

    await close();
});
