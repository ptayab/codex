import React, { useState, useEffect } from "react";

function Channels() {
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState("");
    const [postImages, setPostImages] = useState([]);

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

            console.log('Posts data:', jsonData); // Log the received data

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
            formData.append("user_id",2 /* Provide the user_id here */);
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
            }
        } catch (error) {
            console.error('Error:', error.message);
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

    return (
        <div style={{ display: "flex" }}>
            {/* Left side - List of channels */}
            <div style={{ flex: 1 }}>
                <h1>Channels</h1>
                <button type="button" onClick={handleCreateChannelClick}>
                    Create Channel
                </button>
                <ul>
                    {channels.map(channel => (
                        <li key={channel.id} onClick={() => handleChannelClick(channel)}>
                            {channel.name}
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
                            <input
                                type="text"
                                placeholder="Enter post text"
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => setPostImages(e.target.files)}
                            />
                            <button type="button" onClick={handleCreatePostClick}>Create Post</button>
                        </div>
                        <ul>
                            {posts && posts.map(post => (
                                <li key={post.id}>{post.post}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Channels;
