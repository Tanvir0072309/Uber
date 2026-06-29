const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonewebtocken')

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name atleast 3 character Long']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name atleast 3 character Long']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be atleast 5 character long']
    },
    password: {
        type: String,
        required: true,
    },
    socketId: {
        type: String,
    }
})