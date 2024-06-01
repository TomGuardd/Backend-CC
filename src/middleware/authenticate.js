import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Invalid token." });
    }
};

export const authorize = (req, res, next) => {
    if (req.user.user_id !== req.params.userId) {
        return res.status(403).json({ message: "Unauthorized." });
    }
    next();
};