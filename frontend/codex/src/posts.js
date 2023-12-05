import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Posts() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [commentText, setCommentText] = useState("");
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [commenter, setCommenter] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/posts/${postId}`);
                const postData = await response.json();

                console.log('Post ID:', postId);
                console.log('Post data:', postData);

                setPost(postData);

                if (postData && postData.user_id) {
                    getUsername(postData.user_id);
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, [postId]);

    useEffect(() => {
        // Fetch comments when the post changes
        if (post) {
            getComments(post.id);
            // Also fetch likes and dislikes if needed
            // getLikesAndDislikes(post.id);
        }
    }, [post]);

    const getUsername = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`);
            const userData = await response.json();

            console.log('User ID:', userId);
            console.log('User data:', userData[0].username);

            setUsername(userData[0].username);
        } catch (error) {
            console.error(error.message);
        }
    };

    const getCommenter = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`);
            const userData = await response.json();

            setCommenter(userData[0].username);
        } catch (error) {
            console.error(error.message);
        }
    };

    const getComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5000/comments/${postId}`);
            const commentsData = await response.json();

            // Fetch and set the commenter for each comment
            const commentsWithCommenters = await Promise.all(
                commentsData.map(async (comment) => {
                    const commenterData = await fetch(`http://localhost:5000/users/${comment.user_id}`);
                    const commenter = await commenterData.json();
                    return { ...comment, commenter: commenter[0].username };
                })
            );

            console.log('Comments data:', commentsWithCommenters);
            setComments(commentsWithCommenters);
        } catch (error) {
            console.error(error.message);
        }
    };

    // Function to handle posting a comment
    const postComment = async () => {
        try {
            console.log('user.userId:', user.userId);
            console.log('commentText:', commentText);
            console.log('post.id:', post.id);

            const response = await fetch(`http://localhost:5000/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.userId,
                    comment: commentText,
                    post_id: post.id,
                }),
            });

            if (response.ok) {
                // Refresh comments after posting
                getComments(post.id);
                // Clear the comment text input
                setCommentText("");
            } else {
                console.error('Failed to post comment');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // Function to handle liking the post
    const likePost = async () => {
        // Implement the logic to send a request to like the post
    };

    // Function to handle disliking the post
    const dislikePost = async () => {
        // Implement the logic to send a request to dislike the post
    };

    return (
        <div>
            <h1>Post with Comments</h1>
            {post && (
                <div>
                    <p>{post.post}</p>
                    {/* Display images */}
                    {post.images && post.images.map((image, index) => (
                        <img
                            key={index}
                            src={`data:image/png;base64, ${image.data}`}
                            alt={`Image ${index + 1}`}
                            style={{ maxWidth: '100%', maxHeight: '400px' }}
                        />
                    ))}
                </div>
            )}
            Author: {username}

            {/* Like and Dislike buttons */}
            <div>
                <button onClick={likePost}>Like</button>
                <span>{likes}</span>
                <button onClick={dislikePost}>Dislike</button>
                <span>{dislikes}</span>
            </div>

            {/* Comment section */}
            <div>
                <h2>Comments</h2>
                <ul>
                    {comments.map(comment => (
                        <li key={comment.id}>
                            <strong>{comment.commenter}:</strong> {comment.comment}
                        </li>
                    ))}
                </ul>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <button onClick={postComment}>Post Comment</button>
            </div>
        </div>
    );
}

export default Posts;
