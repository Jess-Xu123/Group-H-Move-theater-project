CREATE DATABASE users_system;
USE users_system;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE user_profiles (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT,
--     full_name VARCHAR(100),
--     user_level VARCHAR(100),
--     address VARCHAR(255),
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );