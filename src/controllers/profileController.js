import { bucket } from '../config/storage.config.js';
import { User, Profile } from '../models/associations.js';

const handleDbError = (error, res) => {
    console.error('Database error:', error);
    return res.status(500).json({ message: "Internal server error" });
};

// Get User Profile
export const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({
            where: { user_id: userId },
            attributes: ['user_id', 'email'],
            include: [{
                model: Profile,
                attributes: ['name', 'profile_picture_url']
            }]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const profile = user.Profile;

        if (!profile) {
            return res.status(404).json({ message: "Profile not found for this user." });
        }

        const userProfile = {
            user_id: user.user_id,
            email: user.email,
            name: profile.name,
            profile_picture_url: profile.profile_picture_url || 'https://storage.googleapis.com/tomguard/profile-picture/default.png'
        };

        res.status(200).json(userProfile);
    } catch (error) {
        handleDbError(error, res);
    }
};

// Update User Name
export const updateUserName = async (req, res) => {
    const { userId, newName } = req.body;
    if (!newName) {
        return res.status(400).json({ message: "New name is required." });
    }

    try {
        const profile = await Profile.findOne({ where: { user_id: userId } });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found for this user." });
        }

        await Profile.update({ name: newName }, { where: { user_id: userId } });

        res.status(200).json({ message: "Name updated successfully." });
    } catch (error) {
        handleDbError(error, res);
    }
};

// Upload or Update Profile Picture
export const uploadProfilePicture = async (req, res) => {
    const { userId } = req.params;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "No image file provided." });
    }

    const folder = 'profile-picture';
    const newFileName = `${folder}/${userId}-${Date.now()}-${file.originalname}`;
    const newBlob = bucket.file(newFileName);

    try {
        const profile = await Profile.findOne({ where: { user_id: userId } });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found for this user." });
        }

        const currentPictureUrl = profile.profile_picture_url;
        const currentFileName = currentPictureUrl?.split('/').pop();

        if (currentPictureUrl && !currentPictureUrl.includes('default.png')) {
            const oldBlob = bucket.file(`${folder}/${currentFileName}`);
            await oldBlob.delete();
        }

        const blobStream = newBlob.createWriteStream({
            resumable: false
        });

        blobStream.on('error', err => res.status(500).json({ message: err.message }));

        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${newBlob.name}`;
            await Profile.update({ profile_picture_url: publicUrl }, { where: { user_id: userId } });
            res.status(200).json({ message: "Profile picture uploaded successfully.", url: publicUrl });
        });

        blobStream.end(file.buffer);
    } catch (error) {
        handleDbError(error, res);
    }
};

// Get Profile Picture URL
export const getProfilePicture = async (req, res) => {
    const { userId } = req.params;

    try {
        const profile = await Profile.findOne({
            where: { user_id: userId },
            attributes: ['profile_picture_url']
        });

        if (!profile) {
            return res.status(404).json({ message: "User not found." });
        }

        const profilePictureUrl = profile.profile_picture_url || 'https://storage.googleapis.com/tomguard/profile-picture/default.png';

        res.status(200).json({ url: profilePictureUrl });
    } catch (error) {
        handleDbError(error, res);
    }
};