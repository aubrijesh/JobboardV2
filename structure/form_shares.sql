-- Table to store sharable links for forms
CREATE TABLE IF NOT EXISTS form_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  formid INT NOT NULL,
  share_token VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255),
  state_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (formid) REFERENCES forms(id) ON DELETE CASCADE
);