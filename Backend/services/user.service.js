const userModel = require('../models/user.model.js');


module.exports.createUser = async({
    firstname,lastname,email,password
}) => {
    if (!firstname || !email || !password) {
        throw new Error('All fields Required');
    }
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    })

    return user;
}