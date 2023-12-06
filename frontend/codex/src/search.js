import React, { useState } from "react";

function SearchResults({ results }) {
  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            <strong>{result.type}: </strong>
            {result.username || result.name || result.post || result.comment || result.reply}
            <div>created by: {result.username} </div></li>
        ))}
      </ul>
    </div>
    
  );
}

function Search() {
  const [contentSearch, setContentSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [mostPosts, setMostPosts] = useState(false);
  const [leastPosts, setLeastPosts] = useState(false);
  const [highestRanking, setHighestRanking] = useState(false);
  const [lowestRanking, setLowestRanking] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postResults, setPostResults] = useState([]);
  const [likesResults, setLikesResults] = useState([]);

  const handleContentSearch = () => {
    fetch(`http://localhost:5000/search/${encodeURIComponent(contentSearch)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Content Search Results:", data);
        setSearchResults(data.results);
      })
      .catch((error) => {
        console.error("Error fetching content search results:", error);
      });
  };

  const handleUserSearch = () => {
    // Make the API call for user search
    

    fetch(`http://localhost:5000/search/user/${userSearch}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User Search Results:", data);
        setSearchResults(data.results);
      })
      .catch((error) => {
        console.error("Error fetching user search results:", error);
      });
  };

  const handleMostPostsSearch = () => {
    // Make the API call for most searched posts
    fetch("http://localhost:5000/search/mostposts/search", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Most Searched Posts Results:", data);
  
        // Assuming the server response structure has 'user_id' and 'posts' properties
        const { user, posts } = data;
  
        console.log('user', user.user_id);  
  
        // Make a separate API call to get the username based on the user_id
        fetch(`http://localhost:5000/users/${user.user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((userData) => {
            console.log("User Data:", userData[0].username);
  
            // Assuming the server response structure has a 'username' property
            const username = userData[0].username;
  
            // Set the state with the appropriate structure
            setPostResults({ username, posts });
            console.log("post Results:", postResults);
          })
          .catch((error) => {
            console.error("Error fetching username:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching most searched posts:", error);
      });
  };
  

  const handleLeastPostsSearch = () => {
    // Make the API call for least searched posts
    fetch("http://localhost:5000/search/leastposts/search", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Least Searched Posts Results:", data);
  
        // Assuming the server response structure has 'user_id' and 'posts' properties
        const { user, posts } = data;
  
        console.log('user', user.user_id);  
  
        // Make a separate API call to get the username based on the user_id
        fetch(`http://localhost:5000/users/${user.user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((userData) => {
            console.log("User Data:", userData[0].username);
  
            // Assuming the server response structure has a 'username' property
            const username = userData[0].username;
  
            // Set the state with the appropriate structure
            setPostResults({ username, posts });
            console.log("post Results:", postResults);
          })
          .catch((error) => {
            console.error("Error fetching username:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching least searched posts:", error);
      });
  };
  


    const handleHighestRankingSearch = () => {
        // Make the API call for highest-ranking posts
        fetch("http://localhost:5000/search/mostlikes/search", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Highest Ranking Posts Results:", data);
      
            // Assuming the server response structure has 'type', 'id', 'post', 'comment', 'reply', and 'likes' properties
            const highestRankingPost = data.results[0];
      
            // Set the state with the appropriate structure
            setLikesResults(highestRankingPost);
            console.log("post Results:", likesResults);
          })
          .catch((error) => {
            console.error("Error fetching highest-ranking posts:", error);
          });
      };
    

  const handleLowestRankingSearch = () => {
  // Make the API call for highest-ranking posts
  fetch("http://localhost:5000/search/mostdislikes/search", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Highest Ranking Posts Results:", data);

      // Assuming the server response structure has 'type', 'id', 'post', 'comment', 'reply', and 'likes' properties
      const highestRankingPost = data.results[0];

      // Set the state with the appropriate structure
      setLikesResults(highestRankingPost);
      console.log("post Results:", likesResults);
    })
    .catch((error) => {
      console.error("Error fetching highest-ranking posts:", error);
    });
  };

  return (
    <div>
      <h2>Search</h2>

      {/* Content Search */}
      <div>
        <label>Content Search:</label>
        <input
          type="text"
          value={contentSearch}
          onChange={(e) => setContentSearch(e.target.value)}
        />
        <button onClick={handleContentSearch}>Search Content</button>
      </div>

      {/* User Search */}
      <div>
        <label>User Search:</label>
        <input
          type="text"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <button onClick={handleUserSearch}>Search User</button>
      </div>

        {/* Display Search Results */}
        <SearchResults results={searchResults} />

      {/* User with Most/Least Posts */}
      <div>
        <label>Most Posts:</label>
        <button onClick={handleMostPostsSearch}>Search Most Posts</button>
        <label>Least Posts:</label>
        <button onClick={handleLeastPostsSearch}>Search Least Posts</button>

        {/* display search results */}
        <div>
            <h2>Posts were created by: {postResults.username} </h2>
            <ul>
                {postResults.posts &&
                postResults.posts.map((post) => (
                    <li key={post.id}>
                        {post.post}
                    </li>
                ))}
            </ul>
            </div>
        </div>



      {/* User with Highest/Lowest Ranking */}
      <div>
        <label>Highest Ranking:</label>
        <button onClick={handleHighestRankingSearch}>Search Highest Ranking</button>
        <label>Lowest Ranking:</label>
        <button onClick={handleLowestRankingSearch}>Search Lowest Ranking</button>
      </div>
          
        {/* Display Search Results */}
        <div>
            <h2>Rank Results:</h2>
            <ul>
                {likesResults &&
                <li key={likesResults.id}>
                    type: {likesResults.type} <br />
                    content: {likesResults.post || likesResults.comment || likesResults.reply}
                </li>
                }
            </ul>
            </div>
            
    </div>
  );
}

export default Search;
