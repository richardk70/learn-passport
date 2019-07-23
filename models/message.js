// models/message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
        trim: true
    },
    fromID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // the person that RECEIVES the message is the owner
    to: {
        type: String
    },
    toID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    },
    folder: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: String
    },
    secsSince1970: {
        type: Number
    }
});

module.exports = mongoose.model('Message', messageSchema);