const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const blacklistTokenModel = require('../models/blacklistToken.model');

function extractToken(req) {
    return req.cookies?.token || req.headers.authorization?.split(' ')[1];
}

module.exports.authUser = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports.authCaptain = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);
        if (!captain) return res.status(401).json({ message: 'Unauthorized' });

        req.captain = captain;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};