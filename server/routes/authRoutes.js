import { Router } from "express";
import passport from "passport";
import {login, verify, refreshToken, logout, signup, deleteUser} from "../service/authService.js";

const router = Router();

// Initiate google OAuth login
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("http://localhost:3000/udfyld-til-opskrift");
    }
);

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get("/verify", verify);
router.post("/refresh", refreshToken);
router.delete("/delete", deleteUser);


export default router;