const test = require('node:test');
const assert = require('node:assert');
const { startTestServer, mockMysql, mockRedis } = require('./test-helper');

test('AIaaS Service Route Tests', async (t) => {
    const { port, close } = await startTestServer();
    const baseUrl = `http://localhost:${port}/api`;

    await t.test('GET /aiaas-services - success', async () => {
        const mockServices = [{ id: 1, name: 'Service 1' }];
        mockRedis.get.mock.mockImplementation(async () => null);
        mockMysql.query.mock.mockImplementation(async () => [mockServices]);

        const res = await fetch(`${baseUrl}/aiaas-services`);
        const data = await res.json();
        assert.strictEqual(res.status, 200);
        assert.deepStrictEqual(data, mockServices);
    });

    await t.test('GET /aiaas-service/:id - success', async () => {
        const mockService = { id: 1, name: 'Service 1' };
        mockRedis.get.mock.mockImplementation(async () => null);
        mockMysql.query.mock.mockImplementation(async () => [[mockService]]);

        const res = await fetch(`${baseUrl}/aiaas-service/1`);
        const data = await res.json();
        assert.strictEqual(res.status, 200);
        assert.deepStrictEqual(data, mockService);
    });

    await close();
});
