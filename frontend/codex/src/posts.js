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
    const [likedPosts, setLikedPosts] = useState(() => {
        // Initialize likedPosts from localStorage or an empty array if not present
        const storedLikedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
        return storedLikedPosts;
    });
    const [dislikedPosts, setDislikedPosts] = useState(() => {
        // Initialize dislikedPosts from localStorage or an empty array if not present
        const storedDislikedPosts = JSON.parse(localStorage.getItem('dislikedPosts')) || [];
        return storedDislikedPosts;
    });
    const [likedComments, setLikedComments] = useState(() => {
        // Initialize likedComments from localStorage or an empty array if not present
        const storedLikedComments = JSON.parse(localStorage.getItem('likedComments')) || [];
        return storedLikedComments;
    });
    const [dislikedComments, setDislikedComments] = useState(() => {
        // Initialize dislikedComments from localStorage or an empty array if not present
        const storedDislikedComments = JSON.parse(localStorage.getItem('dislikedComments')) || [];
        return storedDislikedComments;
    });
    const [likedReplies, setLikedReplies] = useState(() => {
        // Initialize likedReplies from localStorage or an empty array if not present
        const storedLikedReplies = JSON.parse(localStorage.getItem('likedReplies')) || [];
        return storedLikedReplies;
    });
    const [dislikedReplies, setDislikedReplies] = useState(() => {
        // Initialize dislikedReplies from localStorage or an empty array if not present
        const storedDislikedReplies = JSON.parse(localStorage.getItem('dislikedReplies')) || [];
        return storedDislikedReplies;
    });



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
        try {
            console.log('likedPosts', likedPosts);
            console.log('likes', post.likes);
            console.log('user.userId', user.userId)
            if (!likedPosts.includes(post.id)) {
                const response = await fetch(`http://localhost:5000/posts/like/${post.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.userId,
                    }),
                });

                if (response.ok) {
                    console.log('Liked post', post.id);
                    // Update likedPosts state and localStorage
                    const updatedLikedPosts = [...likedPosts, post.id];
                    setLikedPosts(updatedLikedPosts);
                    localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));

                    // Increment the like count in the post state
                    setPost((prevPost) => ({ ...prevPost, likes: prevPost.likes + 1 }));
                    console.log('current post in like post', post)
                } else {
                    console.error('Failed to like comment');
                }
            } else {
                console.log('Comment already liked by the user.');
            }
        } catch (error) {
            console.error(error.message);
        }

    };

    // Function to handle disliking the post
    const dislikePost = async () => {
        try {
            if (!dislikedPosts.includes(post.id)) {
                const response = await fetch(`http://localhost:5000/posts/dislike/${post.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.userId,
                    }),
                });

                if (response.ok) {
                    // Update dislikedPosts state and localStorage
                    const updatedDislikedPosts = [...dislikedPosts, post.id];
                    setDislikedPosts(updatedDislikedPosts);
                    localStorage.setItem('dislikedPosts', JSON.stringify(updatedDislikedPosts));

                    // Increment the dislike count in the post state
                    setPost((prevPost) => ({ ...prevPost, dislikes: prevPost.dislikes + 1 }));
                } else {
                    console.error('Failed to dislike comment');
                }
            } else {
                console.log('Comment already disliked by the user.');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // Function to handle liking a comment
    const likeComment = async (commentId) => {
        try {
            if (!likedComments.includes(commentId)) {
                const response = await fetch(`http://localhost:5000/comments/like/${commentId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.userId,
                    }),
                });

                if (response.ok) {
                    // Update likedComments state and localStorage
                    const updatedLikedComments = [...likedComments, commentId];
                    setLikedComments(updatedLikedComments);
                    localStorage.setItem('likedComments', JSON.stringify(updatedLikedComments));

                    // Increment the like count in the comments state
                    setComments((prevComments) =>
                        prevComments.map((prevComment) =>
                            prevComment.id === commentId
                                ? { ...prevComment, likes: prevComment.likes + 1 }
                                : prevComment
                        )
                    );
                } else {
                    console.error('Failed to like comment');
                }
            } else {
                console.log('Comment already liked by the user.');
            }
        } catch (error) {
            console.error(error.message);
        }
    };
      
    // Function to handle disliking a comment
    const dislikeComment = async (commentId) => {
        try {
            if (!likedComments.includes(commentId)) {
                const response = await fetch(`http://localhost:5000/comments/dislike/${commentId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.userId,
                    }),
                });

                if (response.ok) {
                    // Update dislikedComments state and localStorage
                    const updatedDislikedComments = [...dislikedComments, commentId];
                    setDislikedComments(updatedDislikedComments);
                    localStorage.setItem('dislikedComments', JSON.stringify(updatedDislikedComments));

                    // Increment the dislike count in the comments state
                    setComments((prevComments) =>
                        prevComments.map((prevComment) =>
                            prevComment.id === commentId
                                ? { ...prevComment, dislikes: prevComment.dislikes + 1 }
                                : prevComment
                        )
                    );
                } else {
                    console.error('Failed to dislike comment');
                }
            }
        }
        catch (error) {
            console.error(error.message);
        }
    };



    const toggleReplies = async (commentId) => {

        // Toggle showReplies and set replyingTo to the commentId
        setShowReplies((prevShowReplies) => !prevShowReplies);
        setReplyingTo(commentId);

        try {
            // Fetch replies for the selected comment
            await getReplies(commentId);


            console.log('replies', replies);
        } catch (error) {
            console.error(error.message);
        }



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
            console.log('repliesWithRepliers', repliesWithRepliers);
            console.log('repliesData', repliesData);
        } catch (error) {
            console.error(error.message);
        }
    };

    // function to handle liking a reply
    const likeReply = async (replyId) => {
        try {
            if (!likedReplies.includes(replyId)) {
                const response = await fetch(`http://localhost:5000/replies/like/${replyId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.userId,
                    }),
                });

                if (response.ok) {
                    // Update likedReplies state and localStorage
                    const updatedLikedReplies = [...likedReplies, replyId];
                    setLikedReplies(updatedLikedReplies);
                    localStorage.setItem('likedReplies', JSON.stringify(updatedLikedReplies));

                    // Increment the like count in the replies state
                    setReplies((prevReplies) =>
                        prevReplies.map((prevReply) =>
                            prevReply.id === replyId
                                ? { ...prevReply, likes: prevReply.likes + 1 }
                                : prevReply
                        )
                    );
                } else {
                    console.error('Failed to like reply');
                }
            } else {
                console.log('Reply already liked by the user.');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // Function to handle disliking a reply
    const dislikeReply = async (replyId) => {
        try {
            if (!dislikedReplies.includes(replyId)) {
                const response = await fetch(`http://localhost:5000/replies/dislike/${replyId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.userId,
                    }),
                });

                if (response.ok) {
                    // Update dislikedReplies state and localStorage
                    const updatedDislikedReplies = [...dislikedReplies, replyId];
                    setDislikedReplies(updatedDislikedReplies);
                    localStorage.setItem('dislikedReplies', JSON.stringify(updatedDislikedReplies));

                    // Increment the dislike count in the replies state
                    setReplies((prevReplies) =>
                        prevReplies.map((prevReply) =>
                            prevReply.id === replyId
                                ? { ...prevReply, dislikes: prevReply.dislikes + 1 }
                                : prevReply
                        )
                    );
                } else {
                    console.error('Failed to dislike reply');
                }
            } else {
                console.log('Reply already disliked by the user.');
            }
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
  {likedPosts.includes(post?.id) ? (
    <button style={{ color: 'blue' }}>
      👍 Liked
    </button>
  ) : (
    <button onClick={likePost}>
      👍 Like
    </button>
  )}
  <span>Likes: {post?.likes || 0} </span>

  {dislikedPosts.includes(post?.id) ? (
    <button style={{ color: 'blue' }}>
      👎 Disliked
    </button>
  ) : (
    <button onClick={dislikePost}>
      👎 Dislike
    </button>
  )}
  <span>Dislikes: {post?.dislikes || 0} </span>
</div>

    
          {/* Comment section */}
          <div>
            <h2>Comments</h2>
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>
                  <strong>{comment.commenter}:</strong> {comment.comment}
                  <div>

                    {likedComments.includes(comment.id) ? (
                        <button style={{ color: 'blue' }}>👍 Liked</button>
                    ) : (
                        <button onClick={() => likeComment(comment.id)}>👍Like</button>
                    )}
                    <span>Likes: {comment.likes}</span>

                    {dislikedComments.includes(comment.id) ? (
                        <button style={{ color: 'blue' }}>👎 Disliked</button>
                    ) : (
                        <button onClick={() => dislikeComment(comment.id)}>👎 Dislike</button>
                    )}
                    <span>Dislikes: {comment.dislikes}</span>

                    <button onClick={() => toggleReplies(comment.id)}>Replies</button>
        
        {/* Display replies if available */}
        {showReplies && replyingTo === comment.id && (
            <div>
                {replies.map(reply => (
                    <div key={reply.id}>
                        <strong>{reply.replier}:</strong> {reply.reply}
                        <div>
                            {likedReplies.includes(reply.id) ? (
                                <button style={{ color: 'blue' }}>👍 Liked</button>
                            ) : (
                                <button onClick={() => likeReply(reply.id)}>👍 Like</button>
                            )}
                            <span>Likes: {reply.likes}</span>

                            {dislikedReplies.includes(reply.id) ? (
                                <button style={{ color: 'blue' }}>👎 Disliked</button>
                            ) : (
                                <button onClick={() => dislikeReply(reply.id)}>👎 Dislike</button>
                            )}
                            <span>Dislikes: {reply.dislikes}</span>
                            </div>
                    </div>
                ))}
            </div>
        )}

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