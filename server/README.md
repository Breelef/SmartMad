# Database Setup and Population Guide

## Prerequisites

Before you start, ensure that you have the following installed:
- Node.js
- MySQL or MariaDB server running
- And make sure you are in the server folder. With the following command:
```bash
cd .\server\
```
While being in the server folder, install the node modules with the command:
```bash
npm i
```

## 1. Set up your `.env` file

To begin, create a `.env` file at the root of your project (if it doesn't already exist). This file will store your database credentials and other environment-specific variables.

Add the following environment variables to your `.env` file:

```env
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_DATABASE=smartrecipe
DB_HOST=your_database_host
DB_DIALECT=mysql
DB_PORT=3306
```

### Step 2: Create a sql container with Docker
Run the following command to run a SQL server locally through Docker:

```bash
docker compose up
```

### Step 3: Populate the Database
Run the following command to populate your database:

```bash
npm run initdb
```

### Step 4: You can use these SQL users
We have populated our sql server with these users for testing purposes:

**ADMIN**  
Username: `admin`  
Password: `admin_password`

**CUSTOMER**  
Username: `customer`  
Password: `customer_password`

## User privileges and creation SQL statements
``` sql
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin_password';
```
``` sql
GRANT ALL PRIVILEGES ON smartrecipe.* TO 'admin'@'localhost';
```
``` sql
CREATE USER IF NOT EXISTS 'customer'@'localhost' IDENTIFIED BY 'customer_password';
```
``` sql
GRANT SELECT, INSERT, UPDATE ON smartrecipe.users TO 'customer'@'localhost';
GRANT SELECT, INSERT, UPDATE ON smartrecipe.user_prompts TO 'customer'@'localhost';
```

