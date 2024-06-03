import express from 'express';
import multer from 'multer';
import { getUserProfile, updateProfile } from '../controllers/profileController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }

    const fileName = file.originalname.split('.')[0];
    if (fileName.length > 100) {
        cb(new Error('File name too long!'), false);
    }
};

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: fileFilter
});

// Route untuk mendapatkan profil pengguna : userId, name, email, profile_picture_url
router.get('/', authenticate, getUserProfile);

// Route untuk mengupdate profil pengguna
router.post('/update', authenticate, upload.single('picture'), updateProfile, (error, req, res, next) => {
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
});

export default router;
