import {generateToken, comparePasswords, verifyToken, hashPassword, decodeToken} from "../auth/authHelpers.js";
import {redisSet, redisGet, checkTokenBlacklist} from "../auth/redisOperations.js";
import {extractAuthToken} from "../auth/authHelpers.js";
import {findUserByEmail, createUser, findUserById, softDeleteUserById, deleteUserPermanently} from "./userService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).send("Invalid user email");
        }

        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
            return res.status(401).send("Invalid password to the user");
        }

        const accessToken = generateToken(email, process.env.JWT_SECRET, '60m');
        res.status(200).json({ accessToken });

    } catch (error) {
        console.error('Error during login:', error);  // Log the error
        res.status(500).send('Internal server error');
    }
};

export const verify = async (req, res) => {
    const token = extractAuthToken(req);
    if (!token) {
        return res.status(401).send("Authentication token is required");
    }
    if (await checkTokenBlacklist(token)) {
        return res.status(401).json({ valid: false, message: 'Token has been invalidated' });
    }
    try{
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        res.json({ valid: true, data: decoded });
    }catch (error){
        res.status(401).json({ valid: false, message: 'Invalid Token' })
    }
}

export const refreshToken = async (req, res) => {
    const token = extractAuthToken(req);
    if (!token) {
        return res.status(401).send("Authentication token is required");
    }

    try {
        if(await checkTokenBlacklist(token)){
            return res.status(401).json({ valid: false, message: 'Refresh token has been invalidated' });
        }
        const decoded = verifyToken(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        const newToken = generateToken(decoded.email, process.env.JWT_SECRET, '1h');
        if (req.cookies.refreshToken) {
            res.cookie('refreshToken', newToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        }
        res.json({ accessToken: newToken });
    }catch (error){
        return res.status(401).json({ error: 'Invalid token', message: error.message });
    }
}


export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const existingUser = await findUserByEmail(email);
        if(existingUser){
            return res.status(409).json({message: 'Email already exists'})
        }
        const hashedPassword = await hashPassword(password);
        const user = await createUser(email, hashedPassword, name);
        res.status(201).json({ message: "User created successfully", userId: user.id });
    }catch (error) {
        res.status(500).json({ message: "Could not create user", error: error.message });
    }
}

export const logout = async (req, res) => {
  const token = extractAuthToken(req);
  if (!token) {
    return res.status(401).send("Authentication token is required");
  }

  try {
    const { exp } = decodeToken(token);
    const ttl = exp ? Math.max(exp - Math.floor(Date.now() / 1000), 0) : 3600;
    await redisSet(`blacklisted:${token}`, 'revoked', ttl);
    res.status(200).send("Logged out successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

export const googleOAuth = async (accessToken, refreshToken, profile, done) => {
  try {
    const userEmail = profile.emails?.[0]?.value;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    let user;
    if (existingUser) {
      user = existingUser;
    } else {
      // If the user doesn't exist, create a new user with OAuth details
      user = await prisma.user.create({
        data: {
          name: profile.displayName,
          email: userEmail,
          oauthId: profile.id,
          oauthProvider: 'google',
        },
      });
    }

    // Generate JWT token
    const token = generateToken(user.email, process.env.JWT_SECRET, '15m');

    // Return user with token
    done(null, { user, token });
  } catch (error) {
    done(error);
  }
};


export const softDeleteUser = async (req, res) => {
    const { userId, password } = req.body;
    try{
        const user = await findUserById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found softDeleteUser' });
        }
        if (await comparePasswords(password, user.password)) {
          const result = await softDeleteUserById(user.id);
          return res.status(200).json({ message: 'User deleted successfully', user: result });
        } else {
          return res.status(403).json({ error: 'Passwords do not match' });
        }

    }catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
}

export const deleteUserPermanent = async (req, res) => {
    const { userId, password } = req.body;
    try{
        const user = await findUserById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found deleteUserPermanent' });
        }
        if (await comparePasswords(password, user.password)) {
          const result = await deleteUserPermanently(user.id);
          return res.status(200).json({ message: 'User deleted successfully', user: result });
        } else {
          return res.status(403).json({ error: 'Passwords do not match' });
        }

    }catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
};

export const deleteUserQuick = async (req, res) => {
    const email = req.body;
    try{
        const user = await prisma.user.findUnique({
            where: email,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found deleteUserQuick" });
        }
        await prisma.user.delete({
            where: { id: user.id },
        });
        return res.json({ message: "User deleted successfully" });
    }catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
}