const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadUserPhoto = require('../middlewares/multer.middleware.js'); // Assuming shared generic multer setup or profile uploader file

router.post('/check-email',
    [
        body('email').isEmail().withMessage('Invalid Email')
    ],
    userController.checkEmail
);

router.post('/register',
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('fullname.firstname').isLength({ min: 3 }).withMessage('First name atleast 3 characters Long !!'),
        body('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 character long')
    ],
    userController.registerUser
);

router.post('/login',
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 character long')
    ],
    userController.loginUser
);

router.get('/profile',
    authMiddleware.authUser,
    userController.getUserProfile
);

router.get('/logout',
    authMiddleware.authUser,
    userController.logoutUser
);

// NEW: Profile Management Endpoints
router.put('/update-profile',
    authMiddleware.authUser,
    uploadUserPhoto.single('profileImage'),
    [
        body('mobile').optional({ checkFalsy: true }).isLength({ min: 7, max: 15 }).withMessage('Mobile number must be between 7 and 15 digits'),
    ],
    userController.updateUserProfile
);

router.get('/photo/:id',
    userController.getUserPhoto
);

module.exports = router;