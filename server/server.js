import express from "express";
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;

app.listen(PORT, () => {
   console.log("Server Running On: ", PORT);
});