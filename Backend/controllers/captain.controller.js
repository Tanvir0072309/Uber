const https = require('https');
const http = require('http');

const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model.js');

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

        const captain = await captainModel.findOne({ email: email.trim().toLowerCase() });

        return res.status(200).json({
            exists: !!captain,
            available: !captain,
            message: captain ? 'Email already exists.' : 'Email is available.'
        });
    } catch (err) {
        next(err);
    }
};

module.exports.checkPlate = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), exists: false });
        }

        const { plate } = req.body;

        if (!plate) {
            return res.status(400).json({
                message: 'Plate number is required.',
                exists: false
            });
        }

        const captain = await captainModel.findOne({ 'vehicle.plate': plate.trim().toUpperCase() });

        return res.status(200).json({
            exists: !!captain,
            available: !captain,
            message: captain ? 'Plate number already exists.' : 'Plate number is available.'
        });
    } catch (err) {
        next(err);
    }
};

module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({
            message: 'Captain already exists with this email.'
        });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({
        token,
        captain
    });
};

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid Email or Password.' });
    }

    const isMatch = await captain.comparePasswords(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid Password' })
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
};

module.exports.getCaptainProfile = async (req, res, next) => {
    try {

        const captain = await captainModel.findById(req.captain._id);

        if (!captain) {
            return res.status(404).json({
                message: 'Captain not found.'
            });
        }

        res.status(200).json(captain);

    } catch (err) {
        next(err);
    }
};

module.exports.logoutCaptain = async (req, res, next) => {

    res.clearCookie('token');

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blacklistTokenModel.create({
        token
    });

    res.status(200).json({
        message: 'Captain logged out successfully.'
    });
};

module.exports.updateCaptainProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updates = {};

        // express-validator + multer both populate req.body for text fields
        // sent as fullname[firstname], fullname[lastname], mobile in FormData.
        const firstname = req.body['fullname[firstname]'] || req.body.fullname?.firstname;
        const lastname = req.body['fullname[lastname]'] || req.body.fullname?.lastname;
        const mobile = req.body.mobile;

        if (firstname) updates['fullname.firstname'] = firstname;
        if (lastname) updates['fullname.lastname'] = lastname;
        if (mobile) updates.mobile = mobile;

        // multer attaches the uploaded file here (see multer.middleware.js)
        // With CloudinaryStorage, multer already uploads the file and
        // req.file.path holds the Cloudinary secure URL (not a local disk path).
        if (req.file) {
            updates.profileImage = req.file.path;
        }

        const updatedCaptain = await captainModel.findByIdAndUpdate(
            req.captain._id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedCaptain) {
            return res.status(404).json({ message: 'Captain not found.' });
        }

        // Returned directly (not wrapped), same shape as GET /captains/profile.
        return res.status(200).json(updatedCaptain);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong while updating profile.' });
    }
};

// Proxies the captain's profile photo through our own server so the raw
// Cloudinary URL is never sent to the client (not visible in Network tab,
// page source, or Inspect Element — only this backend URL is).
module.exports.getCaptainPhoto = async (req, res) => {
    try {
        const captain = await captainModel.findById(req.params.id).select('profileImage');

        if (!captain || !captain.profileImage) {
            return res.status(404).end();
        }

        const imageUrl = captain.profileImage;
        const client = imageUrl.startsWith('https') ? https : http;

        client
            .get(imageUrl, (imgRes) => {
                res.set('Content-Type', imgRes.headers['content-type'] || 'image/jpeg');
                res.set('Cache-Control', 'private, max-age=300');
                imgRes.pipe(res);
            })
            .on('error', () => res.status(502).end());
    } catch (err) {
        console.error(err);
        res.status(404).end();
    }
};