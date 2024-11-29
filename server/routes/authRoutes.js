import { Router } from "express";
import passport from "passport";

const router = Router();

// Initiate GitHub OAuth login
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("http://localhost:3000/udfyld-til-opskrift");
    }
);

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).send("Error logging out");
        res.redirect("http://localhost:3000");
    });
});

export default router;