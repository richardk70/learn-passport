// routes/messages.js

const dayjs = require('dayjs');
const Message = require('../models/message');
const User = require('../models/user');

module.exports = function(app) {

    var allMessages = [];

    // READ ALL // GET /messages?sortBy=createdAt:asc or :desc
    app.get('/messages', async function(req, res) {
        // let now = dayjs();
        // let msSince1970 = new Date().getTime(); // ms since 1970
        // let dayinms = 86400000; // ms in 1 day
        // console.log(now.format()); // date time in default format
        //console.log(now.format("MM/DD/YY")); // 07/23/19
        try {
            allMessages = await Message.find({}); // get all messages, then sort them
            if (!allMessages) 
                res.status(404).send();

            let now = dayjs().unix(); // seconds right now since 1970
            // go through all messages
            for (message of allMessages) {
                if (now - message.secsSince1970 > 86400)
                    message.createdAt = dayjs(message.secsSince1970*1000).format('MM/DD/YY');
                else
                    message.createdAt = dayjs(message.secsSince1970*1000).format('HH:mm');
            }
           
            let inboxMessages = allMessages.filter( message => message.folder == 'inbox');
            let sentMessages = allMessages.filter( message => message.folder == 'sent');
            let deletedMessages = allMessages.filter( message => message.folder == 'deleted');
            res.render('messages.html', { locals: {
                inboxMessages: inboxMessages,
                sentMessages: sentMessages,
                deletedMessages: deletedMessages            
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
        message.secsSince1970 = dayjs().unix(); // storing timestamp in seconds since 1970
        try {
            let recipient = await User.find({ name: req.body.to }); 
            console.log(recipient); 
            message.toID = recipient._id;
            await message.save();
            res.redirect('/messages');
        } catch (e) {
            res.status(400).send(e);
        }
    });

    // DELETE
    app.delete('/messages', isLoggedIn, async function(req, res) {
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