import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Posts() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [commenter, setCommenter] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/posts/${postId}`);
                const postData = await response.json();

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

    useEffect(() => {
        // Fetch replies when replyingTo changes
        if (replyingTo) {
            getReplies(replyingTo);
        }
    }, [replyingTo]);

    

    const getUsername = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`);
            const userData = await response.json();


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

            setComments(commentsWithCommenters);
        } catch (error) {
            console.error(error.message);
        }
    };

    // Function to handle posting a comment
    const postComment = async () => {
        try {

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

    // Function to handle liking a comment
    const likeComment = async (commentId) => {
        // Implement the logic to send a request to like the comment with commentId
    };

    // Function to handle disliking a comment
    const dislikeComment = async (commentId) => {
        // Implement the logic to send a request to dislike the comment with commentId
    };



    const toggleReplies = (commentId) => {
        setShowReplies((prevShowReplies) => !prevShowReplies);
        setReplyingTo(commentId);
    };

    // Function to handle posting a reply
    const postReply = async () => {
        try {

            const response = await fetch(`http://localhost:5000/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.userId,
                    reply: replyText,
                    comment_id: replyingTo, // Set comment_id for replies
                }),
            });

            if (response.ok) {
                // Refresh comments after posting
                getComments(post.id);
                // Clear the comment text input and reset replyingTo
                setReplyText("");
                setReplyingTo(null);
            } else {
                console.error('Failed to post reply');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const getReplies = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:5000/replies/${commentId}`);
            const repliesData = await response.json();

            // Fetch and set the replier for each reply
            const repliesWithRepliers = await Promise.all(
                repliesData.map(async (reply) => {
                    const replierData = await fetch(`http://localhost:5000/users/${reply.user_id}`);
                    const replier = await replierData.json();
                    return { ...reply, replier: replier[0].username };
                })
            );

            // Update replies state instead of overwriting comments state
            setReplies(repliesWithRepliers);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div>
            <h1>Post with Comments</h1>
            {post && (
                <div>
                    <p>{post.post}</p>
                    {post.images && post.images.length > 0 && (
                        <div>
                            <h3>Attached Images:</h3>
                            {post.images.map((image, index) => (
                                <img key={index} src={image} alt={`Image ${index + 1}`} />
                            ))}
                        </div>
                    )}
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
                            <div>
                                <button onClick={() => likeComment(comment.id)}>Like</button>
                                <button onClick={() => dislikeComment(comment.id)}>Dislike</button>
                                <button onClick={() => toggleReplies(comment.id)}>Replies</button>
                                {/* Render a reply text area if replyingTo matches the comment id */}
                                {replyingTo === comment.id && showReplies && (
                                    <div>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                        />
                                        <button onClick={postReply}>Post Reply</button>
                                    </div>
                                )}
                                {/* Display replies if available */}

                            </div>
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