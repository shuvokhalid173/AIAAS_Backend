require('dotenv').config();
module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001,
    db: {
        // mysql main db
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3307,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'shuvo',
        database: process.env.DB_NAME || 'auth_db',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    },
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
        fakeHash: process.env.FAKE_HASH || '$2b$12$C6UzMDM.H6dfI/f/IKcEeO6V6bJ3u6KDAdAm8YGtSNYGGyRyvE4sW',
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiration: process.env.JWT_EXPIRATION || '15m',
    },
    auth_rules: {
        max_failed_attempts: parseInt(process.env.MAX_FAILED_ATTEMPTS) || 5,
        lock_time_minutes: parseInt(process.env.LOCK_TIME_MINUTES) || 15,
        refresh_token_expiration_days: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAYS) || 7,
    },
}