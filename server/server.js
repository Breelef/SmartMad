import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import passport from "passport";
import session from "express-session";
import {configurePassport} from "./auth/passportGoogle.js";
import authRoutes from "./routes/authRoutes.js";
import recipeCreation from "./routes/recipeCreationRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
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



const PORT = 8080;

app.listen(PORT, () => {
   console.log("Server Running On: ", PORT);
});