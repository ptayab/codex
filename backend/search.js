// search.js
const express = require('express');
const router = express.Router();
const db = require('./database');

// Search 
router.get('/:query', (req, res) => {
    const searchTerm = req.params.query;

    const query = `
        SELECT 'users' AS type, id, username, email
        FROM users
        WHERE username LIKE '%${searchTerm}%' OR email LIKE '%${searchTerm}%'
        
        UNION ALL
        
        SELECT 'channels' AS type, id, name, null AS email
        FROM channels
        WHERE name LIKE '%${searchTerm}%'
        
        UNION ALL
        
        SELECT 'posts' AS type, id, post, null AS email
        FROM posts
        WHERE post LIKE '%${searchTerm}%'
        
        UNION ALL
        
        SELECT 'comments' AS type, id, comment, null AS email
        FROM comments
        WHERE comment LIKE '%${searchTerm}%'
        
        UNION ALL
        
        SELECT 'replies' AS type, id, reply, null AS email
        FROM replies
        WHERE reply LIKE '%${searchTerm}%'
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing search query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ results });
        }
    });
});

router.get('/user/:username', (req, res) => {
    const username = req.params.username;
    const searchTerm = req.query.searchTerm || '';

    // Fetch the user ID based on the entered username
    const getUserIdQuery = `
        SELECT id
        FROM users
        WHERE username = '${username}'
        LIMIT 1;
    `;

    db.query(getUserIdQuery, (err, userResults) => {
        if (err) {
            console.error('Error fetching user ID:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const userId = userResults[0] ? userResults[0].id : null;

            if (userId) {
                // Use the fetched user ID to search for posts, comments, and replies
                const query = `
                    SELECT 'posts' AS type, id, post, null AS email
                    FROM posts
                    WHERE user_id = ${userId} AND post LIKE '%${searchTerm}%'

                    UNION ALL

                    SELECT 'comments' AS type, id, comment, null AS email
                    FROM comments
                    WHERE user_id = ${userId} AND comment LIKE '%${searchTerm}%'

                    UNION ALL

                    SELECT 'replies' AS type, id, reply, null AS email
                    FROM replies
                    WHERE user_id = ${userId} AND reply LIKE '%${searchTerm}%';
                `;

                db.query(query, (err, results) => {
                    if (err) {
                        console.error('Error executing search query:', err);
                        res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                        res.json({ results });
                    }
                });
            } else {
                res.json({ results: [] });
            }
        }
    });
});

router.get('/mostposts/search', (req, res) => {
    console.log('test')
    const query = `
        SELECT user_id, COUNT(*) AS post_count
        FROM posts
        GROUP BY user_id
        ORDER BY post_count DESC
        LIMIT 1;
    `;
    console.log('aew', query);
    console.log('test');

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing search query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const userWithMostPosts = results[0];

            if (userWithMostPosts) {
                // Fetch the posts for the user with the most posts
                const fetchPostsQuery = `
                    SELECT id, post
                    FROM posts
                    WHERE user_id = ${userWithMostPosts.user_id};
                `;

                db.query(fetchPostsQuery, (err, posts) => {
                    if (err) {
                        console.error('Error fetching posts:', err);
                        res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                        res.json({ user: userWithMostPosts, posts });
                    }
                });
            } else {
                res.json({ user: null, posts: [] });
            }
        }
    });
});

router.get('/leastposts/search', (req, res) => {
    const query = `
        SELECT user_id, COUNT(*) AS post_count
        FROM posts
        GROUP BY user_id
        ORDER BY post_count ASC
        LIMIT 1;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing search query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const userWithLeastPosts = results[0];

            if (userWithLeastPosts) {
                // Fetch the posts for the user with the least posts
                const fetchPostsQuery = `
                    SELECT id, post
                    FROM posts
                    WHERE user_id = ${userWithLeastPosts.user_id};
                `;

                db.query(fetchPostsQuery, (err, posts) => {
                    if (err) {
                        console.error('Error fetching posts:', err);
                        res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                        res.json({ user: userWithLeastPosts, posts });
                    }
                });
            } else {
                res.json({ user: null, posts: [] });
            }
        }
    });
});


router.get('/mostlikes/search', (req, res) => {
    const query = `
        SELECT 'posts' AS type, id, post, null AS comment, null AS reply, likes
        FROM posts
        
        UNION ALL
        
        SELECT 'comments' AS type, id, null AS post, comment, null AS reply, likes
        FROM comments
        
        UNION ALL
        
        SELECT 'replies' AS type, id, null AS post, null AS comment, reply, likes
        FROM replies
        
        ORDER BY likes DESC
        LIMIT 1;
        
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing search query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ results });
        }
    });
});

router.get('/mostdislikes/search', (req, res) => {
    const query = `
    SELECT 'posts' AS type, id, post, null AS comment, null AS reply, dislikes
    FROM posts
    
    UNION ALL
    
    SELECT 'comments' AS type, id, null AS post, comment, null AS reply, dislikes
    FROM comments
    
    UNION ALL
    
    SELECT 'replies' AS type, id, null AS post, null AS comment, reply, dislikes
    FROM replies
    
    ORDER BY dislikes DESC
    LIMIT 1;

    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing search query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ results });
        }
    });
});





module.exports = router;
