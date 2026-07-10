const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../middlewares/auth.middleware.js');
// multer.middleware.js does `module.exports = uploadCaptainPhoto`, so this
// MUST be a plain require — not a destructured { upload } — or it's undefined.
const uploadCaptainPhoto = require('../middlewares/multer.middleware.js');

router.post('/check-email',
    [
        body('email').isEmail().withMessage('Invalid Email')
    ],
    captainController.checkEmail
);

router.post('/check-plate',
    [
        body('plate').isLength({ min: 3 }).withMessage('Vehicle plate is required')
    ],
    captainController.checkPlate
);

router.post('/register',
    [
        body('email').isEmail().withMessage('Invalid Email'),

        body('fullname.firstname')
            .isLength({ min: 3 })
            .withMessage('First name must be at least 3 characters long'),

        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),

        body('vehicle.color')
            .isLength({ min: 3 })
            .withMessage('Vehicle color is required'),

        body('vehicle.plate')
            .isLength({ min: 3 })
            .withMessage('Vehicle plate is required'),

        body('vehicle.capacity')
            .isInt({ min: 1 })
            .withMessage('Vehicle capacity must be at least 1'),

        body('vehicle.vehicleType')
            .isIn(['car', 'motorcycle', 'auto'])
            .withMessage('Invalid vehicle type')
    ],
    captainController.registerCaptain
);

router.post('/login',
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 character long')
    ],
    captainController.loginCaptain
);

router.get('/profile',
    authMiddleware.authCaptain,
    captainController.getCaptainProfile
);

router.get('/logout',
    authMiddleware.authCaptain,
    captainController.logoutCaptain
);

router.put('/update-profile',
    authMiddleware.authCaptain,
    uploadCaptainPhoto.single('profileImage'),
    [
        body('mobile').optional({ checkFalsy: true }).isLength({ min: 7, max: 15 }).withMessage('Mobile number must be between 7 and 15 digits'),
    ],
    captainController.updateCaptainProfile
);

// Streams the profile photo through our server — the raw Cloudinary URL
// is never sent to the browser, so it can't be seen via Inspect/Network tab.
router.get('/:id/photo', captainController.getCaptainPhoto);
router.post('/go-online', authMiddleware.authCaptain, captainController.goOnline);
router.post('/go-offline', authMiddleware.authCaptain, captainController.goOffline);

module.exports = router;