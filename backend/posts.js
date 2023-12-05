const express = require('express');
const db = require('./database');
const multer = require('multer');

const router = express.Router();
const upload = multer();

router.get('/', (req, res) => {
    db.query('SELECT * FROM posts', (err, results) => {
        if (err) {
            console.log('Error fetching posts:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(results);
    });
});

router.get('/:postId', (req, res) => {
    const { postId } = req.params;
    db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
        if (err) {
            console.log('Error fetching posts:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(results[0]);
    });
    console.log('Image data:', image);
});

router.post('/', upload.array('images', 5), (req, res) => {
    const { post, user_id, channel_id } = req.body;
    const images = req.files ? req.files.map(file => file.buffer.toString('base64')) : [];

    const sql = 'INSERT INTO posts (post, user_id, channel_id, images) VALUES (?, ?, ?, ?)';
    const values = [post, user_id, channel_id, JSON.stringify(images)];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.log('Error creating post:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(201).json({ message: 'Post created successfully', postId: results.insertId });
    });
});

module.exports = router;
