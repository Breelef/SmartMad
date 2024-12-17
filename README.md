#SmartRecipe

# Project Setup Instructions

## Prerequisites

Before you start, ensure that you have the following installed:
- Node.js
- MySQL or MariaDB server running
- Docker desktop installed and running

## Frontend

## 1. Set up your `.env` file

To begin, create a `.env` file in the server folder. This file will store your database credentials and other environment-specific variables.

Add the following environment variables to your `.env` file:

```env
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=smartrecipe
DB_HOST=localhost
DB_DIALECT=mysql
DB_PORT=3306
DATABASE_URL=mysql://root:@localhost:3306/smartrecipe

NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=
SESSION_SECRET=
GEMINI_API_KEY=
```

Navigate into the `client/smartmad` directory:

```bash
cd client/smartmad
```

Run installations:

```bash
npm i
```

Run the frontend application:

```bash
npm run start
```

## Setup Databases and Seeding

Navigate into the "server" directory

```bash
cd server
```

Run installations:

```bash
npm i
```

Run the docker commpose file - this will spin up docker containers for all 3 databases

```bash
docker compose up
```

Run database/users/tables scripts for all the databases AND seed them - this will take around 30 seconds

```bash
npm run initdb
```

## Backend

Navigate into the server directory (if not already there)

```bash
cd server
```

Run the backend in development mode

```bash
npm run dev
```
