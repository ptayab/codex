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

router.delete('/:postId', (req, res) => {
    const { postId } = req.params;
    db.query('DELETE FROM posts WHERE id = ?', [postId], (err, results) => {
        if (err) {
            console.log('Error deleting post:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json({ message: 'Post deleted successfully' });
    });
});


router.post('/like/:postId', (req, res) => {
    const { postId } = req.params;
    const { user_id } = req.body;

    // Check if the user has already liked the post
    db.query('SELECT * FROM postlikes WHERE post_id = ? AND user_id = ?', [postId, user_id], (err, results) => {
        if (err) {
            console.log('Error checking if user liked post:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            // User has already liked the post
            return res.status(400).json({ error: 'User has already liked this post' });
        }

        // Insert a new like record
        db.query('INSERT INTO postlikes (post_id, user_id) VALUES (?, ?)', [postId, user_id], (err, likeResult) => {
            if (err) {
                console.log('Error creating post like:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Increment the post's likes count
            db.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId], (err, updateResult) => {
                if (err) {
                    console.log('Error updating post likes:', err.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                return res.status(201).json({ message: 'Post liked successfully' });
            });
        });
    });
});

router.post('/dislike/:postId', (req, res) => {
    const { postId } = req.params;
    const { user_id } = req.body;

    // Check if the user has already disliked the post
    db.query('SELECT * FROM postdislikes WHERE post_id = ? AND user_id = ?', [postId, user_id], (err, results) => {
        if (err) {
            console.log('Error checking if user disliked post:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            // User has already disliked the post
            return res.status(400).json({ error: 'User has already disliked this post' });
        }

        // Insert a new dislike record
        db.query('INSERT INTO postdislikes (post_id, user_id) VALUES (?, ?)', [postId, user_id], (err, likeResult) => {
            if (err) {
                console.log('Error creating post dislike:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Increment the post's dislikes count
            db.query('UPDATE posts SET dislikes = dislikes + 1 WHERE id = ?', [postId], (err, updateResult) => {
                if (err) {
                    console.log('Error updating post dislikes:', err.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                return res.status(201).json({ message: 'Post disliked successfully' });
            });
        });
    });
});

module.exports = router;
