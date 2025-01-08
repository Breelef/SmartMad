import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { configurePassport } from "./auth/passportGoogle.js";
import authRoutes from "./routes/authRoutes.js";
import recipeCreation from "./routes/recipeCreationRoute.js";
import userRoutes from "./routes/userRoutes.js";
import neo4jRouter from "./neo4j/neo4jApp.js";
import mongoRouter from "./mongoDB/mongoApp.js";
import sqlCrudRouter from "./routes/sqlCrudRouter.js";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Swagger setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API documentation for the recipe and ingredient management system',
  },
  servers: [
    {
      url: 'http://localhost:8080',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './mongoDB/mongoApp.js', './neo4j/neo4jApp.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

app.use(authRoutes);
app.use(recipeCreation);
app.use(userRoutes);
app.use('/sql', sqlCrudRouter);
app.use('/neo4j', neo4jRouter);
app.use('/mongo', mongoRouter);

const PORT = 8080;

app.listen(PORT, () => {
  console.log("Server Running On: ", PORT, "Docs on: http://localhost:8080/api-docs");
});
