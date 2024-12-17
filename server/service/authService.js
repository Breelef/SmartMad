import {generateToken, comparePasswords, verifyToken, hashPassword, decodeToken} from "../auth/authHelpers.js";
import {redisSet, redisGet, checkTokenBlacklist} from "../auth/redisOperations.js";
import {extractAuthToken} from "../auth/authHelpers.js";
import {findUserByEmail, createUser} from "./userService.js";


const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if(!user){
            return res.status(401).send("Invalid credentials");
        }
        const isValidPassword = await comparePasswords(password, user.password);
        if(!isValidPassword){
            return res.status(401).send("Invalid credentials");
        }
        const accessToken = generateToken(email, JWT_SECRET, '15m');
        res.json( {accessToken} );

    }catch (error){
        res.status(500).send("Internal server error");
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
        const decoded = verifyToken(token, JWT_SECRET);
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
        if(await checkTokenBlacklist(refreshToken)){
            return res.status(401).json({ valid: false, message: 'Refresh token has been invalidated' });
        }
        const decoded = verifyToken(refreshToken, JWT_SECRET, { ignoreExpiration: true });
        const newToken = generateToken(decoded.email, JWT_SECRET, '1h');
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
      const ttl = exp ? exp - Math.floor(Date.now() / 1000) : 3600;
      await redisSet(`blacklisted:${token}`, 'revoked', ttl);
      res.status(200).send("Logged out successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

export const googleOAuth = async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.emails?.[0]?.value },
    });

    if (existingUser) {
      const token = generateToken(existingUser.email, JWT_SECRET, '15m');
      return done(null, existingUser);
    }

    // If the user doesn't exist, create a new user with OAuth details
    const newUser = await prisma.user.create({
      data: {
        name: profile.displayName,  // Use the displayName from Google
        email: profile.emails?.[0]?.value,
        oauthId: profile.id,        // Store the OAuth id
        oauthProvider: 'google',    // Identify the provider as 'google'
      },
    });
    const token = generateToken(newUser.email, JWT_SECRET, '15m');
    return done(null, { user: newUser, token });
  } catch (error) {
    done(error);
  }
};

export const updateUser = async (req, res) => {
    const { userId, newEmail, oldPassword, newPassword } = req.body;
    try{
        const user = await User.findByPk(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        if(newEmail && newEmail !== user.email) {
            const emailExists = await User.findOne({ where: newEmail });
            if (emailExists) {
                return res.status(409).json({ message: "Email already in use" });
            }
            user.email = newEmail;
        }
        if (newPassword && oldPassword){
            const isMatch = await comparePasswords(oldPassword, user.password);
            if(!isMatch){
                 return res.status(401).json({ message: "Old password is incorrect" });
            }
            user.password = await hashPassword(newPassword, 12);
        }
        await user.save();
        res.json({ message: "User updated successfully" });
    }catch (error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteUser = async (req, res) => {
    const { userId, password } = req.body;
    try {
        const user = await User.findByPk(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Password is incorrect"})
        }
        await user.destroy();
        res.json({message: "User deleted"})
    }catch (error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}