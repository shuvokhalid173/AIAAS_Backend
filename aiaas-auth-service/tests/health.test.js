const test = require('node:test');
const assert = require('node:assert');
const { startTestServer, mockMysql, mockRedis } = require('./test-helper');

test('Health Route Tests', async (t) => {
    const { port, close } = await startTestServer();
    const baseUrl = `http://localhost:${port}/api/health`;

    await t.test('GET /health - success', async () => {
        mockMysql.query.mock.mockImplementationOnce(async () => [[]]);
        mockRedis.ping.mock.mockImplementationOnce(async () => 'PONG');

        const res = await fetch(`${baseUrl}/health`);
        const data = await res.json();

        assert.strictEqual(res.status, 200);
        assert.strictEqual(data.status, 'healthy');
        assert.strictEqual(data.checks.database, 'healthy');
        assert.strictEqual(data.checks.redis, 'healthy');
    });

    await t.test('GET /health - database unhealthy', async () => {
        mockMysql.query.mock.mockImplementationOnce(async () => { throw new Error('DB Error'); });
        mockRedis.ping.mock.mockImplementationOnce(async () => 'PONG');

        const res = await fetch(`${baseUrl}/health`);
        const data = await res.json();

        assert.strictEqual(res.status, 503);
        assert.strictEqual(data.status, 'unhealthy');
        assert.strictEqual(data.checks.database, 'unhealthy');
        assert.strictEqual(data.checks.redis, 'healthy');
    });

    await t.test('GET /health - redis unhealthy', async () => {
        mockMysql.query.mock.mockImplementationOnce(async () => [[]]);
        mockRedis.ping.mock.mockImplementationOnce(async () => { throw new Error('Redis Error'); });

        const res = await fetch(`${baseUrl}/health`);
        const data = await res.json();

        assert.strictEqual(res.status, 503);
        assert.strictEqual(data.status, 'unhealthy');
        assert.strictEqual(data.checks.database, 'healthy');
        assert.strictEqual(data.checks.redis, 'unhealthy');
    });

    await close();
});
