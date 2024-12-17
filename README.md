#SmartRecipe

# Project Setup Instructions

## Frontend

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
