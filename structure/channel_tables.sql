-- SQL for channel table to enable multi-tenant users
CREATE TABLE IF NOT EXISTS channels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Add channel_id to forms table
ALTER TABLE forms ADD COLUMN channel_id INT;
ALTER TABLE forms ADD CONSTRAINT fk_forms_channel FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE SET NULL;

-- Add channel_id to users table
ALTER TABLE users ADD COLUMN channel_id INT;
ALTER TABLE users ADD CONSTRAINT fk_users_channel FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE SET NULL;

-- Add columns to support Google signup and direct signup
ALTER TABLE users 
  ADD COLUMN signup_method VARCHAR(50) DEFAULT 'direct', -- 'direct' or 'google'
  ADD COLUMN google_id VARCHAR(255) DEFAULT NULL, -- Google unique user id
  ADD COLUMN name VARCHAR(255) DEFAULT NULL; -- User's display name

-- On signup (direct or Google), create a channel and associate user
-- Example logic (to be implemented in backend):
-- 1. INSERT INTO channels (name, description) VALUES ('<email>', NULL);
-- 2. Get new channel id
-- 3. INSERT INTO users (email, password, signup_method, google_id, name, channel_id) VALUES (..., <channel_id>);
