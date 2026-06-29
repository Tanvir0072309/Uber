const express = require('express');
const router = express.Router();
const { body } = require('express-validator')
const userController = require('../controllers/user.controller.js')


router.post('/register', [
    body('email').isEmail().withMessage('Onvalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('first name atleast 3 characters Long !!'),
    body('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 character long')
],
    userController.registerUser
)

module.exports = router;