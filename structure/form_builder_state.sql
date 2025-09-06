-- Table to store form builder structure (fields dropped, order, config)
CREATE TABLE IF NOT EXISTS forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  state_json JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
