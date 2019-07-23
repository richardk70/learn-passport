// routes/tasks.js

const multer = require('multer');
const sharp = require('sharp');

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
                
            await task.remove();
        } catch (e) {
            res.status(500).send(e);
        }
    });

    // TASK PHOTO FUNCTIONS
    // upload
    const upload = multer({
        limits: {
            fileSize: 2000000,
        },
        fileFilter(req, file, callback) {
            let temp = file.originalname.toLowerCase();
            if (!temp.match(/\.(jpg|png|jpeg)$/)) 
                // if not above types
                return callback(new Error('File must be an image file.'));
            if (file.fileSize > 2000000)
                return callback(new Error('File must be under 2 MB in size.'));

            // if it passes
            callback(undefined, true);
        }
    });

    app.post('/tasks/photo', isLoggedIn, upload.single('photo'), async function(req, res) {
        let task = await Task.findById(req.body.taskNum);
        const buffer = await sharp(req.file.buffer).resize( {width: 100, height: 100 }).png().toBuffer();
        task.photo = buffer;
        await task.save();
        res.redirect('/profile');
    }, (error, req, res, next) => {
        res.status(400).send({ error:err.message });
    });

    app.delete('/tasks/photo', isLoggedIn, async function(req, res) {
        try {
            req.task.photo = undefined;
            await req.task.save();
            res.send();
        } catch (e) {
            res.status(500).send(e);
        }
    });

    app.get('/tasks/:id/photo', async function(res, res) {
        try {
            let task = await Task.findById(req.params.id);
            if (!task || !task.photo)
                throw new Error();

            res.set('Content-Type', 'image/png');
            res.send(task.photo);
        } catch (e) {
            res.status(404).send(e);
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