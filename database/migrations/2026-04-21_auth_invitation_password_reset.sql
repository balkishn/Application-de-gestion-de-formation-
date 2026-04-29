-- Auth flow migration: email identifier, first-login enforcement, password reset token support
-- Targets MySQL schema used by the formation backend.

SET @db_name = DATABASE();

-- 1) Ensure login can be nullable (users invited by email may not have a login yet)
ALTER TABLE utilisateur
    MODIFY COLUMN login VARCHAR(255) NULL;

-- 2) Add email column if missing
SET @sql_add_email = (
    SELECT IF(
        EXISTS (
            SELECT 1
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = @db_name
              AND TABLE_NAME = 'utilisateur'
              AND COLUMN_NAME = 'email'
        ),
        'SELECT 1',
        'ALTER TABLE utilisateur ADD COLUMN email VARCHAR(255) NULL'
    )
);
PREPARE stmt_add_email FROM @sql_add_email;
EXECUTE stmt_add_email;
DEALLOCATE PREPARE stmt_add_email;

-- 3) Add must_change_password flag if missing
SET @sql_add_must_change = (
    SELECT IF(
        EXISTS (
            SELECT 1
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = @db_name
              AND TABLE_NAME = 'utilisateur'
              AND COLUMN_NAME = 'must_change_password'
        ),
        'SELECT 1',
        'ALTER TABLE utilisateur ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT FALSE'
    )
);
PREPARE stmt_add_must_change FROM @sql_add_must_change;
EXECUTE stmt_add_must_change;
DEALLOCATE PREPARE stmt_add_must_change;

-- 4) Add reset token fields if missing
SET @sql_add_reset_token = (
    SELECT IF(
        EXISTS (
            SELECT 1
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = @db_name
              AND TABLE_NAME = 'utilisateur'
              AND COLUMN_NAME = 'reset_token'
        ),
        'SELECT 1',
        'ALTER TABLE utilisateur ADD COLUMN reset_token VARCHAR(255) NULL'
    )
);
PREPARE stmt_add_reset_token FROM @sql_add_reset_token;
EXECUTE stmt_add_reset_token;
DEALLOCATE PREPARE stmt_add_reset_token;

SET @sql_add_reset_expiry = (
    SELECT IF(
        EXISTS (
            SELECT 1
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = @db_name
              AND TABLE_NAME = 'utilisateur'
              AND COLUMN_NAME = 'reset_token_expires_at'
        ),
        'SELECT 1',
        'ALTER TABLE utilisateur ADD COLUMN reset_token_expires_at DATETIME NULL'
    )
);
PREPARE stmt_add_reset_expiry FROM @sql_add_reset_expiry;
EXECUTE stmt_add_reset_expiry;
DEALLOCATE PREPARE stmt_add_reset_expiry;

-- 5) Ensure uniqueness for login/email/reset_token
SET @sql_add_uq_login = (
    SELECT IF(
        EXISTS (
            SELECT 1
            FROM information_schema.STATISTICS
            WHERE TABLE_SCHEMA = @db_name
              AND TABLE_NAME = 'utilisateur'
              AND INDEX_NAME = 'uk_utilisateur_login'
        ),
        'SELECT 1',
        'CREATE UNIQUE INDEX uk_utilisateur_login ON utilisateur (login)'
    )
);
PREPARE stmt_add_uq_login FROM @sql_add_uq_login;
EXECUTE stmt_add_uq_login;
DEALLOCATE PREPARE stmt_add_uq_login;

SET @sql_add_uq_email = (
    SELECT IF(
        EXISTS (
            SELECT 1
            FROM information_schema.STATISTICS
            WHERE TABLE_SCHEMA = @db_name
              AND TABLE_NAME = 'utilisateur'
              AND INDEX_NAME = 'uk_utilisateur_email'
        ),
        'SELECT 1',
        'CREATE UNIQUE INDEX uk_utilisateur_email ON utilisateur (email)'
    )
);
PREPARE stmt_add_uq_email FROM @sql_add_uq_email;
EXECUTE stmt_add_uq_email;
DEALLOCATE PREPARE stmt_add_uq_email;

SET @sql_add_uq_reset_token = (
    SELECT IF(
        EXISTS (
            SELECT 1
            FROM information_schema.STATISTICS
            WHERE TABLE_SCHEMA = @db_name
              AND TABLE_NAME = 'utilisateur'
              AND INDEX_NAME = 'uk_utilisateur_reset_token'
        ),
        'SELECT 1',
        'CREATE UNIQUE INDEX uk_utilisateur_reset_token ON utilisateur (reset_token)'
    )
);
PREPARE stmt_add_uq_reset_token FROM @sql_add_uq_reset_token;
EXECUTE stmt_add_uq_reset_token;
DEALLOCATE PREPARE stmt_add_uq_reset_token;
