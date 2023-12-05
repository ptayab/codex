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

router.post('/like/:commentId', (req, res) => {
    const { commentId } = req.params;
    const { user_id } = req.body;
  
    // Check if the user has already liked the comment
    db.query('SELECT * FROM commentlikes WHERE comment_id = ? AND user_id = ?', [commentId, user_id], (err, results) => {
      if (err) {
        console.log('Error checking if user liked comment:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (results.length > 0) {
        // User has already liked the comment
        return res.status(400).json({ error: 'User has already liked this comment' });
      }
  
      // Insert a new like record
      db.query('INSERT INTO commentlikes (comment_id, user_id) VALUES (?, ?)', [commentId, user_id], (err, likeResult) => {
        if (err) {
          console.log('Error liking comment:', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        // Update the comment's like count
        db.query('UPDATE comments SET likes = likes + 1 WHERE id = ?', [commentId], (err, updateResult) => {
          if (err) {
            console.log('Error updating comment likes:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
  
          return res.status(200).json({ message: 'Comment liked successfully' });
        });
      });
    });
  });


router.post('/dislike/:commentId', (req, res) => {
    const { commentId } = req.params;
    const { user_id } = req.body;

    // Check if the user has already disliked the comment
    db.query('SELECT * FROM commentdislikes WHERE comment_id = ? AND user_id = ?', [commentId, user_id], (err, results) => {
        if (err) {
            console.log('Error checking if user disliked comment:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            // User has already disliked the comment
            return res.status(400).json({ error: 'User has already disliked this comment' });
        }

        // Insert a new dislike record
        db.query('INSERT INTO commentdislikes (comment_id, user_id) VALUES (?, ?)', [commentId, user_id], (err, likeResult) => {
            if (err) {
                console.log('Error disliking comment:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Update the comment's dislike count
            db.query('UPDATE comments SET dislikes = dislikes + 1 WHERE id = ?', [commentId], (err, updateResult) => {
                if (err) {
                    console.log('Error updating comment dislikes:', err.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                return res.status(200).json({ message: 'Comment disliked successfully' });
            });
        });
    });
});

module.exports = router;