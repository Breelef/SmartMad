import { Router } from "express";
import passport from "passport";
import {login, verify, refreshToken, logout, signup, softDeleteUser, deleteUserPermanent, deleteUserQuick} from "../service/authService.js";
import {generateToken} from "../auth/authHelpers.js";
import { PrismaClient } from "@prisma/client";
import {findUserByEmail} from "../service/userService.js";
import {authenticateToken} from "../middleware/auth.js";

const prisma = new PrismaClient();

const router = Router();

// Callback Route
router.get("/auth/google/signup/callback", async (req, res) => {
  const { code } = req.query;

  try {
    // 1. Exchange the authorization code for an access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorDetails = await tokenResponse.json();
      console.error("Error during token exchange:", errorDetails);
      return res.status(500).json({ error: 'OAuth token exchange failed' });
    }

    const { access_token } = await tokenResponse.json();

    // 2. Fetch user information from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userInfoResponse.ok) {
      const errorDetails = await tokenResponse.json();
      console.error("Error during token exchange:", errorDetails);
      return res.status(500).json({ error: 'OAuth token exchange failed' });

    }

    const { email, name, id: oauthId } = await userInfoResponse.json();

    // 3. Check if the user exists in the database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please log in." });
    }

    // 4. Create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        oauthId,
        provider: "google", // Specify the provider
      },
    });

    // 5. Return a success response
    res.status(200).json({ message: "User created", user: newUser });
  } catch (error) {
    console.error("Error during Google sign-up:", error.message);
    res.status(500).send("Sign-up failed");
  }
});


router.get("/auth/google/login/callback", async (req, res) => {
  const { code } = req.query;

  try {
    // 1. Exchange the authorization code for an access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorDetails = await tokenResponse.json();
      console.error("Error during token exchange:", errorDetails);
      return res.status(500).json({ error: 'OAuth token exchange failed' });
    }

    const { access_token } = await tokenResponse.json();

    // 2. Fetch user information from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userInfoResponse.ok) {
      const errorDetails = await tokenResponse.json();
      console.error("Error during token exchange:", errorDetails);
      return res.status(500).json({ error: 'OAuth token exchange failed' });

    }

    const { email } = await userInfoResponse.json();

    // 3. Check if the user exists in the database
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User does not exist. Please sign up first." });
    }

    // 4. Generate a token (e.g., JWT)
    const accessToken = generateToken(user.email, process.env.JWT_SECRET, "15m"); // Replace with your JWT generation logic

    // 5. Return the token and user data
    res.json({ token: accessToken, user });
  } catch (error) {
    console.error("Error during Google login:", error.message);
    res.status(500).send("Login failed");
  }
});





router.post('/auth/login', login);
router.post('/auth/signup', signup);
router.post('/auth/logout', logout);
router.get("/auth/verify", authenticateToken, verify);
router.post("/auth/refresh", refreshToken);
router.put("/auth/softDelete", softDeleteUser);
router.delete("/auth/delete", deleteUserPermanent);
router.get("/auth/deleteQuick", deleteUserQuick);


export default router;