# Database Setup and Population Guide

## Prerequisites

Before you start, ensure that you have the following installed:
- Node.js
- MySQL or MariaDB server running

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

### Step 2: Populate the Database
Run the following command to populate your database:

```bash
npm run initdb
```

### Step 3: You can use these SQL users
We have populated our sql server with these users:
**ADMIN USER:**  
Username: `admin`  
Password: `admin_password`

**CUSTOMER USER:**  
Username: `customer`  
Password: `customer_password`

