const mongoose = require('mongoose');

/*
 * IMPORTANT: Sirf yeh fields store hote hain — GPS history (position-by-position
 * tracking) yahan kabhi save NAHI hoti. Live location sirf socket ke through
 * memory me udti hai aur captain.model.location me sirf "current" point store
 * hota hai — is schema me kahin bhi koi array/history nahi hai.
 */
const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain'
    },

    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },

    pickupCoords: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    destinationCoords: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },

    fare: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },

    otp: {
        type: String,
        required: true,
        select: false
    },

    distance: {
        type: Number, // km
        required: true
    },
    duration: {
        type: Number, // minutes
        required: true
    },

    vehicleType: {
        type: String,
        enum: ['car', 'motorcycle', 'auto'],
        default: 'car'
    }

}, {
    timestamps: true // createdAt / updatedAt
});

const rideModel = mongoose.model('ride', rideSchema);

module.exports = rideModel;