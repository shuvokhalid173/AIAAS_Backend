const test = require('node:test');
const assert = require('node:assert');
const { startTestServer, mockMysql, mockRedis } = require('./test-helper');
const jwt = require('jsonwebtoken');
const { mock } = require('node:test');

test('Org Route Tests', async (t) => {
    const { port, close } = await startTestServer();
    const baseUrl = `http://localhost:${port}/api/orgs`;
    const token = jwt.sign({ sub: 'user-id', sid: 'session-id', ver: 1 }, 'test-secret');

    // Default mock for authentication middleware
    mockRedis.get.mock.mockImplementation(async (key) => {
        if (key.startsWith('session:')) return 'not revoked';
        return null;
    });

    await t.test('POST /orgs - success', async () => {
        const mockConnection = {
            query: mock.fn(async (sql) => {
                if (sql.includes('FROM auth_users')) return [[{ id: 'user-id', status: 'active' }]];
                return [[]];
            }),
            beginTransaction: mock.fn(async () => {}),
            commit: mock.fn(async () => {}),
            release: mock.fn(() => {}),
        };
        mockMysql.getConnection.mock.mockImplementation(async () => mockConnection);

        const res = await fetch(`${baseUrl}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'Test Org',
                slug: 'test-org'
            })
        });

        const data = await res.json();
        assert.strictEqual(res.status, 201);
        assert.strictEqual(data.name, 'Test Org');
    });

    await t.test('GET /orgs/u/:userId - success', async () => {
        const mockOrgs = [{ id: 'org-id', name: 'Test Org' }];
        mockMysql.query.mock.mockImplementation(async (sql) => {
            if (sql.includes('FROM auth_orgs')) return [mockOrgs];
            return [[]];
        });

        const res = await fetch(`${baseUrl}/u/user-id`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        assert.strictEqual(res.status, 200);
        assert.deepStrictEqual(data, mockOrgs);
    });

    await t.test('POST /orgs/switch - success', async () => {
        mockMysql.query.mock.mockImplementation(async (sql) => {
            if (sql.includes('FROM auth_orgs_users')) return [[{ user_id: 'user-id', org_id: 'org-id' }]];
            if (sql.includes('FROM auth_sessions')) return [[{ id: 'session-id', refresh_token_hash: 'hash' }]];
            return [[]];
        });

        const res = await fetch(`${baseUrl}/switch`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ orgId: 'org-id' })
        });

        const data = await res.json();
        assert.strictEqual(res.status, 200);
        assert.ok(data.token.accessToken);
    });

    await close();
});
