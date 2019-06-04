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
    app.patch('/tasks/:id', isLoggedIn, async function(req, res) {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['description', 'complete'];
        const isValidOperation = updates.every((update) => {
            return allowedUpdates.includes(udpate);
        });
        if (!isValidOperation)
            return res.status(400).send({ error: 'Inavlid update.' });

        let _id = req.params.id;
        try {
            const task = await Task.findById({ _id, owner: req.user._id });
            if (!task)
                res.status(404).send();

            updates.forEach((update) => task[update] = req.body[update]);
            await task.save();
            res.send(task)
        } catch (e) {
            res.status(500).send(e);
        }
    });

    // EDIT
    app.post('/tasks/edit', isLoggedIn, async function(req, res) {
        console.log(req.body);
        let owner = req.body;
        try {
            let task = await Task.findById({ id, owner: req.user._id });
            if (!task)
                res.status(404).send();

            // send the new task here
            task.description = req.body.description;
            task.complete = req.body.complete;
            await task.save();
            res.send(task);
            // res.redirect(303, '/profile');

        } catch (e) {
            res.status(500).send(e);
        }
    });

    // DELETE
    app.delete('/tasks', isLoggedIn, async function(req, res) {
        console.log(req.body);
        let id = req.body.id;
        // let id = ObjectID.fromString(req.body.id);
        try {
            let task = await Task.findByIdAndDelete({ id, owner: req.user._id });
            if (!task)
                res.status(404).send();

            // using 303 changes it to a GET request
            res.redirect(303, '/profile');
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