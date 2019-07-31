// routes/messages.js

const dayjs = require('dayjs');
const Message = require('../models/message');
const User = require('../models/user');

module.exports = function(app) {

    var allMessages = [];

    // READ ALL // GET /messages?sortBy=createdAt:asc or :desc
    app.get('/messages', async function(req, res) {
        try {
            allMessages = await Message.find({}); // get all messages, then sort them
            if (!allMessages) 
                res.status(404).send();
           
            res.render('messages.html', { locals: {
                allMessages: JSON.stringify(allMessages) // convert DB results to JSON strings format for sending    
            }});
        } catch (e) {
            res.status(500).send(e);
        }
    });

    // CREATE
    app.post('/messages', isLoggedIn, async function(req, res) {
        let message = new Message();
        message.completed = true;
        message.fromID = req.user._id;
        message.from = req.user.name;
        message.to = req.body.to;
        message.subject = req.body.subject;
        message.body = req.body.body;
        message.folder = 'sent';
        message.createdAt = dayjs().unix(); // storing timestamp as seconds since 1970
        try {
            let recipient = await User.findOne({ name: req.body.to }); 
            console.log(recipient); 
            message.toID = recipient._id;
            if (message.toID) {
                await message.save();
            }
            res.redirect('/messages');
        } catch (e) {
            res.status(400).send(e);
        }
    });

    // DELETE
    app.delete('/messages', isLoggedIn, async function(req, res) {
        console.log(req.body);
        let id = req.body.id;
        try {
            let message = await Message.findByIdAndDelete({ _id: id });
            if (!message)
                res.status(404).send();

            await message.remove();
        } catch (e) {
            res.status(500).send(e);
        }
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    // otherwise return to home page
    res.render('index', { locals: {
        msgExists: 'Must be logged in'
    }});
}