import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Channels() {
    const [channels, setChannels] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState("");
    const [postImages, setPostImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getChannels();
    }, []); // Fetch channels when the component mounts

    useEffect(() => {
        if (selectedChannel) {
            getPosts(selectedChannel.id);
        } else {
            // Clear posts if no channel is selected
            setPosts([]);
        }
    }, [selectedChannel]); // Fetch posts when the selected channel changes

    const getChannels = async () => {
        try {
            const response = await fetch('http://localhost:5000/channels');
            const jsonData = await response.json();

            // Update the channels state with the fetched data
            setChannels(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

    const getPosts = async (channelId) => {
        try {
            const response = await fetch(`http://localhost:5000/channels/${channelId}/posts`);
            const jsonData = await response.json();

            // Update the posts state with the fetched data
            setPosts(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleCreatePostClick = async () => {
        try {
            // Check if postText is not empty before proceeding
            if (!postText.trim()) {
                console.error('Post text cannot be empty');
                return;
            }
    
            const formData = new FormData();
            formData.append("post", postText);
            formData.append("user_id", user.userId);
            formData.append("channel_id", selectedChannel.id);
    
            // Append each selected image file to the form data
            for (let i = 0; i < postImages.length; i++) {
                formData.append("images", postImages[i]);
            }
    
            const response = await fetch('http://localhost:5000/posts', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                console.log('Post created successfully!');
                // Update the list of channels after creating a new post
                getPosts(selectedChannel.id);
                setPostText("");
                setPostImages([]);
            } else {
                console.error('Error creating post:', response.statusText);
                // Provide user feedback on error
                alert('Error creating post. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Provide user feedback on error
            alert('Error creating post. Please try again.');
        }
    };
    
    

    const handleCreateChannelClick = async () => {
        const channelName = window.prompt("Enter Channel Name:");

        if (channelName) {
            try {
                const response = await fetch('http://localhost:5000/channels', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: channelName }),
                });

                if (response.ok) {
                    console.log('Channel created successfully!');
                    // Update the list of channels after creating a new channel
                    getChannels();
                } else {
                    console.error('Error creating channel:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
    };

    const handleChannelClick = (channel) => {
        setSelectedChannel(channel);
    };

    const handlePostClick = (postId) => {
        // Navigate to the post page using React Router
    
        navigate(`/posts/${postId}`);
    };

    const UserListClick = (userId) => {
        
        navigate('/userlist');
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/users/logout', {
                method: 'POST',
                credentials: 'include', // Include credentials for cross-origin requests
            });
    
            if (response.ok) {
                console.log('Logout successful!');
                // Clear user data from local storage
                localStorage.removeItem('accessToken');
                console.log('User data cleared from local storage:', localStorage.getItem('user'));
                // Redirect to the login page or any other appropriate page
                navigate('/');
            } else {
                console.error('Error logging out:', response.statusText);
                // Provide user feedback on error
                alert('Error logging out. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Provide user feedback on error
            alert('Error logging out. Please try again.');
        }
    };
    
    const handleDeleteChannelClick = async () => {
        if (!selectedChannel) {
          console.error('No channel selected');
          return;
        }
    
        if (user.userId === 1) {
          try {
            const response = await fetch(`http://localhost:5000/channels/${selectedChannel.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
    
            if (response.ok) {
              console.log('Channel deleted successfully!');
              // Update the list of channels after deleting the channel
              getChannels();
              // Clear selected channel
              setSelectedChannel(null);
            } else {
              console.error('Error deleting channel:', response.statusText);
            }
          } catch (error) {
            console.error('Error:', error.message);
          }
        } else {
          console.error('User is not an admin. Cannot delete channel.');
        }
      };

      const renderDeleteButton = () => {
        // Check if the user is an admin and has userId equal to 1
        if (user.userId === 1) {
            return (
                <button type="button" onClick={handleDeleteChannelClick}>
                    Delete Channel
                </button>
            );
        }
        return null;
    };
    
    const handleDeletePostClick = async (postId) => {
        if (!selectedChannel) {
            console.error('No channel selected');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:5000/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                console.log('Post deleted successfully!');
                // Update the list of posts after deleting the post
                getPosts(selectedChannel.id);
            } else {
                console.error('Error deleting post:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };


    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Color block at the top */}
            <div className="header">
                {/* Logout button */}

                <form onSubmit={handleLogout} style={{ float: "right" }}>
                    <button type="submit" style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                        Logout
                    </button>
                </form>
                {user?.userId === 1 && (
                    <button onClick={() => UserListClick(user.userId)} style={{ float: "right", marginRight: "10px" }}>
                        Userlist
                    </button>
                )}
            </div>

        <div style={{ display: "flex" }}>
            {/* Left side - List of channels */}
            <div style={{ flex: 1 }}>
                <h1>Channels</h1>
                <button type="button" onClick={handleCreateChannelClick}>
                    Create Channel
                </button>
                <ul>
                    {channels.map((channel) => (
                        <li key={channel.id} onClick={() => handleChannelClick(channel)}>
                            {channel.name} {renderDeleteButton()}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right side - List of posts */}
            <div style={{ flex: 2 }}>
                {/* Display selected channel's posts */}
                {selectedChannel && (
                    <div>
                        <h2>{selectedChannel.name} Posts</h2>
                        <div>
                            <textarea
                                placeholder="Enter post text"
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                style={{ width: "80%", minHeight: "100px", resize: "vertical" }} // Adjust the size as needed
                            />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => setPostImages(e.target.files)}
                            />
                            {/* Display selected images */}
                            {postImages.length > 0 && (
                                <div>
                                    <h3>Selected Images:</h3>
                                    <ul>
                                        {Array.from(postImages).map((image, index) => (
                                            <li key={index}>
                                                <p>{image.name}</p>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Selected Image ${index + 1}`}
                                                    style={{ maxWidth: "100px", maxHeight: "100px", marginRight: "10px" }}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <button type="button" onClick={handleCreatePostClick}>
                                Create Post
                            </button>
                        </div>
                        <ul>
                            {posts &&
                                posts.map((post) => (
                                    
                                    <li key={post.id}>
                                    <div>
                                        <p>{post.post}</p>
                                        {/* Button to handle viewing the post */}
                                        <button onClick={() => handlePostClick(post.id)}>View Post</button>
                                        
                                        {/* Button to handle deleting the post (visible only for admin) */}
                                        {user?.userId === 1 && (
                                            <button onClick={() => handleDeletePostClick(post.id)}>Delete Post</button>
                                        )}
                                    </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    </div>
    );
}

export default Channels;