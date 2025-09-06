-- Table for storing preview submissions (from preview)
CREATE TABLE IF NOT EXISTS preview_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data JSON NOT NULL,
    formid INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
