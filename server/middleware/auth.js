import dotenv from "dotenv";
import {verifyToken} from "../auth/authHelpers.js";

dotenv.config()

export const authenticateToken = (req, res, next ) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  try {
    req.user = verifyToken(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}