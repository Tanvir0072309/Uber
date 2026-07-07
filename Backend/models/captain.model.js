const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({

    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be atleast length of 3 characters']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be atleast length of 3 characters']
        }
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\S+@\S+\.\S+$/,
            'Please enter a valid email address'
        ]
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    socketId: {
        type: String
    },

    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },

    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: 3
        },

        plate: {
            type: String,
            required: true,
            unique: true
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        },

        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto']
        }
    },

    location: {
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    },

    mobile: {
        type: String,
        default: null,
    },

    profileImage: {
        type: String,
        default: null, // stores a relative path like "/uploads/captains/xyz.jpg"
    }

}, {
    timestamps: true
});

captainSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

captainSchema.methods.comparePasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const captainModel = mongoose.model('Captain', captainSchema);

module.exports = captainModel;