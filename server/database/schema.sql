-- CMD: mysql -u your_username -p < schema.sql
-- powershell: Get-Content .\schema.sql | mysql -u root -p

-- Create database
CREATE DATABASE IF NOT EXISTS recipes_db;
USE recipes_db;

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create recipes table
CREATE TABLE recipes (
    recipe_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(100),
    prep_time INT,
    cook_time INT,
    total_time INT,
    portions INT,
    final_comment TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create ingredients table
CREATE TABLE ingredients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT,
    name VARCHAR(100),
    value DECIMAL(5, 2),
    unit VARCHAR(20),
    number INT,
    comment TEXT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);


CREATE TABLE instructions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT,
    part VARCHAR(100),
    step TEXT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);
