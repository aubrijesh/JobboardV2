-- MySQL table for storing form submissions as JSON
CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  share_id INT NOT NULL,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (share_id) REFERENCES form_shares(id) ON DELETE CASCADE
);

-- Migration: Change submissions table to use share_id instead of form_id
ALTER TABLE submissions DROP FOREIGN KEY submissions_ibfk_1;
ALTER TABLE submissions DROP COLUMN form_id;
ALTER TABLE submissions ADD COLUMN share_id INT NOT NULL AFTER id;
ALTER TABLE submissions ADD CONSTRAINT fk_submissions_share FOREIGN KEY (share_id) REFERENCES form_shares(id) ON DELETE CASCADE;
