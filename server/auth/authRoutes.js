import { Router } from "express";
import {login, verify, refreshToken, logout, signup, updateUser, deleteUser} from "../services/authService.js";

const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get("/verify", verify);
router.post("/refresh", refreshToken);
router.post("/update", updateUser);
router.delete("/delete", deleteUser);

export default router;