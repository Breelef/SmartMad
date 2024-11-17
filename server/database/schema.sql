    -- CMD: mysql -u your_username -p < schema.sql
    -- powershell: Get-Content .\schema.sql | mysql -u root -p

    -- Create database
    CREATE DATABASE IF NOT EXISTS smartrecipe;
    USE smartrecipe;

    -- Create a read-write user for specific tables
    CREATE USER 'customer'@'localhost' IDENTIFIED BY 'customer_password';
    GRANT SELECT, INSERT, UPDATE ON my_app_db.users TO 'customer'@'localhost';
    GRANT SELECT, INSERT, UPDATE ON my_app_db.userprompts TO 'customer'@'localhost';

    -- Create an admin user with full privileges
    CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin_password';
    GRANT ALL PRIVILEGES ON my_app_db.* TO 'admin'@'localhost';

    -- Apply changes
    FLUSH PRIVILEGES;