const express = require('express');
const db = require('./database');

const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM replies', (err, results) => {
        if (err) {
            console.log('Error fetching replies:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(results);
    });
});

router.get('/:commentId', (req, res) => {
    const { commentId } = req.params;
    db.query('SELECT * FROM replies WHERE comment_id = ?', [commentId], (err, results) => {
        if (err) {
            console.log('Error fetching replies:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(results);
    });
});

router.post('/', (req, res) => {
    const { reply, user_id, comment_id } = req.body;

    const sql = 'INSERT INTO replies (reply, user_id, comment_id) VALUES (?, ?, ?)';
    const values = [reply, user_id, comment_id];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.log('Error creating reply:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(201).json({ message: 'Reply created successfully', replyId: results.insertId });
    });
});

router.post("/like/:replyId", (req, res) => {
    const { replyId } = req.params;
    const { user_id } = req.body;

    // Check if the user has already liked the reply
    db.query('SELECT * FROM replylikes WHERE reply_id = ? AND user_id = ?', [replyId, user_id], (err, results) => {
        if (err) {
            console.log('Error fetching replylikes:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Reply already liked' });
        }
        // If the user has not already liked the reply, create a new like
        const sql = 'INSERT INTO replylikes (user_id, reply_id) VALUES (?, ?)';
        const values = [user_id, replyId];
        db.query(sql, values, (err) => {
            if (err) {
                console.log('Error creating replylike:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(201).json({ message: 'Reply liked successfully' });
        });
    });
}
);

router.post("/dislike/:replyId", (req, res) => {
    const { replyId } = req.params;
    const { user_id } = req.body;

    // Check if the user has already disliked the reply
    db.query('SELECT * FROM replydislikes WHERE reply_id = ? AND user_id = ?', [replyId, user_id], (err, results) => {
        if (err) {
            console.log('Error fetching replydislikes:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Reply already disliked' });
        }
        // If the user has not already disliked the reply, create a new dislike
        const sql = 'INSERT INTO replydislikes (user_id, reply_id) VALUES (?, ?)';
        const values = [user_id, replyId];
        db.query(sql, values, (err) => {
            if (err) {
                console.log('Error creating replydislike:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(201).json({ message: 'Reply disliked successfully' });
        });
    });
}
);

router.delete('/:replyId', (req, res) => {
    const { replyId } = req.params;
    db.query('DELETE FROM replies WHERE id = ?', [replyId], (err, results) => {
        if (err) {
            console.log('Error deleting reply:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json({ message: 'Reply deleted successfully' });
    });
});


module.exports = router;
