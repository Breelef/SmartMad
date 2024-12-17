import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (email, secret, expiresIn) => {
    return jwt.sign({ email }, secret, { expiresIn });
};

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

export const decodeToken = (token) => {
    return jwt.decode(token);
}

export const comparePasswords = async (inputPassword, userPassword) => {
    return bcrypt.compare(inputPassword, userPassword);
};

export const hashPassword = async (password, saltRounds = 12) => {
    return bcrypt.hash(password, saltRounds);
};

export const extractAuthToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        return req.headers.authorization.split(' ')[1];  // Bearer token
    } else if (req.cookies && req.cookies.authToken) {
        return req.cookies.authToken;  // Cookie token
    }
    return null;
};