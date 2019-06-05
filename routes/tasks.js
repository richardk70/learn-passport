// routes/tasks.js
const Task = require('../models/task');

module.exports = function(app) {

    // READ ALL
    app.get('/tasks', async function(req, res) {
        try {
            let tasks = Task.find({});
            if (!tasks)
                res.status(404).send();

            res.send(tasks);
        } catch (e) {
            res.status(500).send(e);
        }
    });

    // CREATE
    app.post('/tasks', isLoggedIn, async function(req, res) {
        let task = new Task();
        task.description = req.body.description;
        task.complete = req.body.taskStatus;
        task.owner = req.user._id;
        try {
            await task.save();
            res.redirect('/profile');
        } catch(e) {
            res.status(400).send(e);
        }
    });

    // UPDATE
    app.patch('/tasks', isLoggedIn, async function(req, res) {
        console.log(req.body);
        let id = req.body.owner;
        try {
            let task = await Task.findById({ _id: id });
            if (!task)
                res.status(404).send();

            // send the new task here
            task.description = req.body.description;
            task.complete = req.body.complete;
            await task.save();
        } catch (e) {
            res.status(500).send(e);
        }
    });

    // DELETE
    app.delete('/tasks', isLoggedIn, async function(req, res) {
        // console.log(req.user); // shows user info 
        // console.log(req.body); // shows { id: 'Object ID number' }

        let id = req.body.id;

        try {
            let task = await Task.findByIdAndDelete({ _id: id, owner: req.user._id });
            if (!task)
                res.status(404).send();
                
            task.remove();
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