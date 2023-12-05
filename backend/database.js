const express = require('express');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    port: 3306,
    password: "Princess123",
});

db.connect((err) => {
    if (err) {
        console.log('Error connecting to the database'); 
        return;
    }
    console.log('Connected to the database');

    db.query('CREATE DATABASE IF NOT EXISTS codex', (err) => {
        if (err) {
            console.log('Error creating database');
            return;
        } else {
            console.log('Database already exists');
        }
    }   );

    // Create the 'users' table if it doesn't exist
    db.query('USE codex', err => {
        if (err) {
            console.log('Error using database `codex`:', err.message);
            return;
        }

        db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
            username varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            password varchar(255) NOT NULL,
            isAdmin BOOLEAN DEFAULT false
        )

    `, (err) => {
        if (err) {
            console.log('Error creating users table:', err.message);
        } else {
            console.log('Table "users" created or already exists');
        }
    });

    // create the channels table
        db.query(`
        CREATE TABLE IF NOT EXISTS channels (
            id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name varchar(255) NOT NULL
        )
    `, (err) => {
        if (err) {
            console.log('Error creating channels table:', err.message);
        } else {
            console.log('Table "channels" created or already exists');
        }
    });

    // create posts table
    db.query(`
    CREATE TABLE IF NOT EXISTS posts (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        post TEXT NOT NULL,
        user_id int NOT NULL,
        channel_id int NOT NULL,
        images JSON,
        likes int DEFAULT 0,
        dislikes int DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (channel_id) REFERENCES channels(id)
    )
`, (err) => {
    if (err) {
        console.log('Error creating posts table:', err.message);
    } else {
        console.log('Table "posts" created or already exists');
    }
    });


    // create comments table
    db.query(`
    CREATE TABLE IF NOT EXISTS comments (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        comment TEXT NOT NULL,
        likes int DEFAULT 0,
        dislikes int DEFAULT 0,
        user_id int NOT NULL,
        post_id int NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id)
    )
`, (err) => {
    if (err) {
        console.log('Error creating comments table:', err.message);
    } else {
        console.log('Table "comments" created or already exists');
    }
    });

    // create replies table
    db.query(`
    CREATE TABLE IF NOT EXISTS replies (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        reply TEXT NOT NULL,
        likes int DEFAULT 0,
        dislikes int DEFAULT 0,
        user_id int NOT NULL,
        comment_id int NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (comment_id) REFERENCES comments(id)
    )
`, (err) => {
    if (err) {
        console.log('Error creating replies table:', err.message);
    } else {
        console.log('Table "replies" created or already exists');
    }
    });


    // create commentlikes table
    db.query(`
    CREATE TABLE IF NOT EXISTS commentlikes (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id int NOT NULL,
        comment_id int NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (comment_id) REFERENCES comments(id)
    )
`, (err) => {
    if (err) {
        console.log('Error creating commentlikes table:', err.message);
    } else {
        console.log('Table "commentlikes" created or already exists');
    }
    });

    // create postlikes table
    db.query(`
    CREATE TABLE IF NOT EXISTS postlikes (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id int NOT NULL,
        post_id int NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id)
    )
`, (err) => {
    if (err) {
        console.log('Error creating postlikes table:', err.message);
    } else {
        console.log('Table "postlikes" created or already exists');
    }
    });

    // create replylikes table
    db.query(`
    CREATE TABLE IF NOT EXISTS replylikes (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id int NOT NULL,
        reply_id int NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (reply_id) REFERENCES replies(id)
    )
`, (err) => {
    if (err) {
        console.log('Error creating replylikes table:', err.message);
    } else {
        console.log('Table "replylikes" created or already exists');
    }
    });

    // create replydislikes table
    db.query(`
    CREATE TABLE IF NOT EXISTS replydislikes (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id int NOT NULL,
        reply_id int NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (reply_id) REFERENCES replies(id)
    )
`, (err) => {  
    if (err) {
        console.log('Error creating replydislikes table:', err.message);
    } else {
        console.log('Table "replydislikes" created or already exists');
    }
    });

    // create postdislikes table
    db.query(`
    CREATE TABLE IF NOT EXISTS postdislikes (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id int NOT NULL,
        post_id int NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id)
    )
`, (err) => {
    if (err) {
        console.log('Error creating postdislikes table:', err.message);
    } else {
        console.log('Table "postdislikes" created or already exists');
    }
});


    // create commentdislikes table
    db.query(`
    CREATE TABLE IF NOT EXISTS commentdislikes (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id int NOT NULL,
        comment_id int NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (comment_id) REFERENCES comments(id)
    )
`, (err) => {
    if (err) {
        console.log('Error creating commentdislikes table:', err.message);
    } else {
        console.log('Table "commentdislikes" created or already exists');
    }
    });
});
    
});




module.exports = db;