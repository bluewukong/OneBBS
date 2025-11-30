-- Sticky Notes BBS Database Schema
-- This SQL file contains the database schema for the Sticky Notes BBS application
-- PostgreSQL compatible version

-- Note: This script assumes you are connected to the 'mydb' database

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT username_length CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 20),
    CONSTRAINT password_length CHECK (LENGTH(password) >= 6 AND LENGTH(password) <= 100)
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    color VARCHAR(20) DEFAULT '#FFEB3B',
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT title_length CHECK (LENGTH(title) >= 1 AND LENGTH(title) <= 100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create replies table
CREATE TABLE IF NOT EXISTS replies (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_replies_post_id_created_at ON replies(post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample data (optional)
-- INSERT INTO users (username, password, email) VALUES 
-- ('testuser', '$2b$10$examplehash', 'test@example.com');

-- INSERT INTO posts (title, content, user_id, color) VALUES 
-- ('Welcome to Sticky Notes BBS!', 'This is a sample post. Feel free to create your own sticky notes!', 1, '#FFEB3B');

-- INSERT INTO replies (content, user_id, post_id) VALUES 
-- ('Great post! Looking forward to using this BBS.', 1, 1);

-- Display table information
SELECT 'Database schema created successfully!' as message;