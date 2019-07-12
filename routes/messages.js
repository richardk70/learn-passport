// routes/messages.js

const Message = require('../models/message');

module.exports = function(app) {
    // read all messages
    app.get('/messages', async function(req, res) {
        res.render('messages.html');
        // try {
        //     let messages = Message.find({});
        //     if (!messages) 
        //         res.status(404).send();
    
        //     res.render('messages.html', { locals: {
        //         messages: messages            
        //     }})
        // } catch (e) {
        //     res.status(500).send(e);
        // }
    });
}