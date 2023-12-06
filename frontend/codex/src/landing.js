import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const userData = await response.json();
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(userData));
                setError('');
                navigate('/channels');
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Error during login:', error.message);
            setError('Internal Server Error');
        }
    };

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
                {error && <div className="error-message">{error}</div>}
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password" // Use type="password" for password fields
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="button" onClick={handleLogin}>
                    Login
                </button>
                <Link to="/signup">
                    <button>Signup</button>
                </Link>
            </div>
        </div>
    );
}

export default Landing;
