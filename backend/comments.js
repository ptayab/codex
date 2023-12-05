const express = require('express');
const db = require('./database');

const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM comments', (err, results) => {
        if (err) {
            console.log('Error fetching comments:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(results);
    });
});

router.get('/:postId', (req, res) => {
    const { postId } = req.params;
    db.query('SELECT * FROM comments WHERE post_id = ?', [postId], (err, results) => {
        if (err) {
            console.log('Error fetching comments:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(results);
    });
});


router.post('/', (req, res) => {
    const { comment, user_id, post_id } = req.body;

    const sql = 'INSERT INTO comments (comment, user_id, post_id) VALUES (?, ?, ?)';
    const values = [comment, user_id, post_id];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.log('Error creating comment:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(201).json({ message: 'Comment created successfully', commentId: results.insertId });
    });
});

router.delete('/:commentId', (req, res) => {
    const { commentId } = req.params;
    db.query('DELETE FROM comments WHERE id = ?', [commentId], (err, results) => {
        if (err) {
            console.log('Error deleting comment:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json({ message: 'Comment deleted successfully' });
    });
});


module.exports = router;