import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; 

function Landing() {
    return (
        <div className="landing-container">
            {/* Left Side */}
            <div className="left-side">
                <h1>Welcome to Codex!</h1>
                Where you can connect, learn, and grow with other students and developers.
                Login or Signup to get started.
                {/* Add any other titles and text here */}
            </div>

            {/* Right Side */}
            <div className="right-side">
                <h2>Login</h2>
                <div>
                    <input type="text" placeholder="Username" />
                </div>
                <div>
                    <input type="text" placeholder="Password" />
                </div>
                <button type="submit">Login</button>
                <Link to="/signup">
                    <button>Signup</button>
                </Link>
            </div>
        </div>
    );
}

export default Landing;
