import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_OPTIONS = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 hari
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
};

export const createTokenSendResponse = (user, res) => {
    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '30d' });

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(200).json({
        message: "Authentication successful",
        token,
        user: {
            user_id: user.user_id,
            email: user.email
        }
    });
};

export const refreshTokenIfNeeded = (req, res, next) => {
    if (req.cookies.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, JWT_SECRET);
            // Periksa jika token akan kedaluwarsa dalam kurang dari 15 hari, perbarui
            if (decoded.exp < Date.now() / 1000 + 15 * 24 * 3600) {
                const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '30d' });
                res.cookie('token', newToken, COOKIE_OPTIONS);
            }
        } catch (error) {
            console.log('Token expired or invalid:', error.message);
            res.clearCookie('token');
        }
    }
    next();
};

export const destroyTokenSendResponse = (res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful" });
};