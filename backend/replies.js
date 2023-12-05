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


module.exports = router;