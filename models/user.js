// models/user.js

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
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
        minlength: 1,
        required: true 
    },
    photo: {
        type: Buffer,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    friends: { type : Array, "default" : [] }
}, { timestamps: true });

 
// for ownership of tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// for ownership of messages
userSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'to'
});

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