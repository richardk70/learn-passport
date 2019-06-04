// models/user.js

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: false,
        trim: true 
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('Email is invalid.');
        }},
    password: {
        type: String,
        trim: true,
        minlength: 4,
        required: true 
    }
}, { timestamps: true });

 
// for ownership of tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;
    return userObj;
}

// methods ///////////////////////////////////////

// generate a hash
userSchema.methods.setPassword = function(password) {
    return bcrypt.hashSync(password, 8);
}
// check if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);