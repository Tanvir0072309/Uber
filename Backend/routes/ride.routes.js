const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// ---------- USER ROUTES ----------

// "Get a Ride" click -> ride DB me store hoti hai, 500m ke andar active
// captains ko socket se 'new-ride' bheja jaata hai
router.post('/create',
    authMiddleware.authUser,
    [
        body('pickup').notEmpty().withMessage('Pickup is required'),
        body('destination').notEmpty().withMessage('Destination is required'),
        body('pickupCoords.lat').isFloat().withMessage('Pickup lat required'),
        body('pickupCoords.lng').isFloat().withMessage('Pickup lng required'),
        body('destinationCoords.lat').isFloat().withMessage('Destination lat required'),
        body('destinationCoords.lng').isFloat().withMessage('Destination lng required')
    ],
    rideController.createRide
);

// LocationSearchPanel ke "niche" section ke liye — last 5 search history
router.get('/recent', authMiddleware.authUser, rideController.getRecentSearches);

// "Get a Pickup" click -> user ke 500m radius ke andar sare ONLINE captains
router.get('/nearby-captains', authMiddleware.authUser, rideController.getNearbyCaptains);

router.get('/history/user', authMiddleware.authUser, rideController.getUserHistory);

// User ya captain dono cancel kar sakte hain
router.post('/cancel', authMiddleware.authUser, rideController.cancelRide);

// ---------- CAPTAIN ROUTES ----------

router.post('/accept', authMiddleware.authCaptain, rideController.acceptRide);
router.post('/start-ride', authMiddleware.authCaptain, rideController.startRide);
router.post('/complete-ride', authMiddleware.authCaptain, rideController.completeRide);
router.get('/history/captain', authMiddleware.authCaptain, rideController.getCaptainHistory);

module.exports = router;