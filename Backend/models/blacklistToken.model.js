const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 24 * 60 * 60
    }
});

const blacklistTokenModel = mongoose.model('blacklistToken', blacklistTokenSchema);

module.exports = blacklistTokenModel;
