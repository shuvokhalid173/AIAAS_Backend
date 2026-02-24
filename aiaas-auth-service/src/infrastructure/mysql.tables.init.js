const pool = require('./mysql.db');

async function initializeTables() {
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS auth_users (
            id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
            email VARCHAR(255) NOT NULL UNIQUE,
            phone VARCHAR(20) NULL UNIQUE,
            is_email_verified BOOLEAN DEFAULT FALSE,
            is_phone_verified BOOLEAN DEFAULT FALSE,
            status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP NULL,
            INDEX idx_email (email),
            INDEX idx_phone (phone),
            INDEX idx_status (status),
            INDEX idx_deleted_at (deleted_at)
        );
    `;

    const createAuthCredentialsTableQuery = `
        CREATE TABLE IF NOT EXISTS auth_credentials (
            id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
            user_id CHAR(36) NOT NULL,
            type ENUM('password', 'google', 'github') NOT NULL,
            secret_hash VARCHAR(255) NULL,
            salt VARCHAR(255) NULL,
            version INT DEFAULT 1,
            is_active BOOLEAN DEFAULT TRUE,
            last_used_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            -- Foreign key constraint
            CONSTRAINT fk_auth_credentials_user_id 
                FOREIGN KEY (user_id) 
                REFERENCES auth_users(id) 
                ON DELETE CASCADE,
            
            -- Indexes for performance
            INDEX idx_user_id (user_id),
            INDEX idx_type (type),
            INDEX idx_is_active (is_active),
            INDEX idx_last_used_at (last_used_at),
            
            -- Ensure only one active credential of each type per user
            UNIQUE INDEX idx_unique_active_type (user_id, type, is_active),
            
            -- For password type, we should have secret_hash and salt
            -- For OAuth types (google, github), secret_hash and salt should be NULL
            CONSTRAINT chk_password_requires_secret 
                CHECK (
                    (type = 'password' AND secret_hash IS NOT NULL AND salt IS NOT NULL) OR
                    (type IN ('google', 'github') AND secret_hash IS NULL AND salt IS NULL)
                )
        );
    `;
}