CREATE TABLE email_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    file_content TEXT NOT NULL,
    email_data TEXT NOT NULL,
    uploaded_file VARCHAR(255) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);