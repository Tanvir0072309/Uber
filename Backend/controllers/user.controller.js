const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
const https = require('https');
const http = require('http');

module.exports.checkEmail = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), exists: false });
        }

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required.',
                exists: false
            });
        }

        const user = await userModel.findOne({ email: email.trim().toLowerCase() });

        return res.status(200).json({
            exists: !!user,
            available: !user,
            message: user ? 'Email already exists.' : 'Email is available.'
        });
    } catch (err) {
        next(err);
    }
};

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });

    if (isUserAlreadyExist) {
        return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const hashPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashPassword
    });

    const token = user.generateAuthToken();
    res.status(201).json({ token, user });
};

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid Email or Password.' });
    }

    const isMatch = await user.comparePasswords(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid Password' });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blacklistTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out successfully' });
};

// NEW: Update user profile details along with profile images uploaded to Cloudinary
module.exports.updateUserProfile = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstname, lastname, mobile } = req.body;
        const updateData = {};

        if (firstname) updateData['fullname.firstname'] = firstname;
        if (lastname) updateData['fullname.lastname'] = lastname;
        if (mobile !== undefined) updateData.mobile = mobile || null;

        if (req.file && req.file.path) {
            updateData.profileImage = req.file.path; // Cloudinary secure URL injected via multer storage
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong while updating profile.' });
    }
};

// NEW: Stream security proxies for assets protection 
module.exports.getUserPhoto = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).select('profileImage');

        if (!user || !user.profileImage) {
            return res.status(404).end();
        }

        const imageUrl = user.profileImage;
        const client = imageUrl.startsWith('https') ? https : http;

        client.get(imageUrl, (imgRes) => {
            res.set('Content-Type', imgRes.headers['content-type'] || 'image/jpeg');
            res.set('Cache-Control', 'private, max-age=300');
            imgRes.pipe(res);
        }).on('error', (e) => {
            console.error(e);
            res.status(500).end();
        });
    } catch (err) {
        console.error(err);
        return res.status(500).end();
    }
};