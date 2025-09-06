-- Table to store form builder structure (fields dropped, order, config)
CREATE TABLE IF NOT EXISTS forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  channel_id INT,
  state_json JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status TINYINT(1) DEFAULT 1 -- 1 = modified, 0 = not modified after share
);
