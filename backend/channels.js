const express = require('express');
const db = require('./database');

const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM channels', (err, results) => {
        if (err) {
            console.log('Error fetching channels:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(results);
    });
});

router.get('/:channelId/posts', (req, res) => {
    const { channelId } = req.params;
    db.query('SELECT * FROM posts WHERE channel_id = ?', [channelId], (err, results) => {
        if (err) {
            console.log('Error fetching posts:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(results);
    });
});

router.post('/', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO channels (name) VALUES (?)', [name], (err, results) => {
        if (err) {
            console.log('Error creating channel:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(201).json({ message: 'Channel created successfully', channelId: results.insertId });
    });
});

module.exports = router;