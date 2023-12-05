const express = require('express');
const cors = require('cors');
const path = require('path'); // Add this line to import the path module
const bodyParser = require('body-parser');
const userRoutes = require('./users');
const channelRoutes = require('./channels');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');
const repliesRoutes = require('./replies');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination directory for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage: storage });

app.use('/users', userRoutes);
app.use('/channels', channelRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/replies', repliesRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
