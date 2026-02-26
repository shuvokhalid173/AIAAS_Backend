const { mock } = require('node:test');
const http = require('node:http');
const path = require('path');

const mockConnection = {
    beginTransaction: mock.fn(async () => {}),
    commit: mock.fn(async () => {}),
    rollback: mock.fn(async () => {}),
    query: mock.fn(async () => [[]]),
    release: mock.fn(() => {}),
};

// Mocks for infrastructure
const mockMysql = {
    query: mock.fn(async () => [[]]),
    execute: mock.fn(async () => [[]]),
    getConnection: mock.fn(async () => mockConnection),
};

const mockRedis = {
    ping: mock.fn(async () => 'PONG'),
    get: mock.fn(async () => null),
    setex: mock.fn(async () => 'OK'),
    set: mock.fn(async () => 'OK'),
    del: mock.fn(async () => 1),
    on: mock.fn(),
};

// Mock BullMQ
const mockQueue = mock.fn(function() {
    this.add = mock.fn(async () => {});
    this.close = mock.fn(async () => {});
});

const mockBullMQ = {
    Queue: mockQueue,
    Worker: mock.fn(),
};

// Populate require.cache to mock infrastructure
// We must do this before requiring app.js
const infrastructurePath = path.resolve(__dirname, '../src/infrastructure');
const mysqlDbPath = path.join(infrastructurePath, 'mysql.db.js');
const redisDbPath = path.join(infrastructurePath, 'redis.db.js');
const redisPath = path.join(infrastructurePath, 'redis.js');
const queuePath = path.join(infrastructurePath, 'queue.js');

const mockModule = (modulePath, exports) => {
    require.cache[modulePath] = {
        id: modulePath,
        filename: modulePath,
        loaded: true,
        exports: exports
    };
};

mockModule(mysqlDbPath, mockMysql);
mockModule(redisDbPath, mockRedis);
mockModule(redisPath, mockRedis);
mockModule(queuePath, { Queue: mockQueue, Worker: mock.fn(), redisClient: mockRedis });

// Set required env vars
process.env.JWT_SECRET = 'test-secret';
process.env.PORT = '0';

// Require app AFTER mocking
const app = require('../src/app');

async function startTestServer() {
    return new Promise((resolve) => {
        const server = http.createServer(app);
        server.listen(0, () => {
            const { port } = server.address();
            resolve({
                port,
                close: () => new Promise((res) => server.close(res))
            });
        });
    });
}

module.exports = {
    startTestServer,
    mockMysql,
    mockRedis,
    app
};
