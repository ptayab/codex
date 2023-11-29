import React from "react";

function Signup() {
    return (
        <div>
        <h1>Signup</h1>
        <div>
                <input type="text" placeholder="Email" />
                </div>
                <div>
                <input type="text" placeholder="Username" />
                </div>
                <div>
                    <input type="text" placeholder="Password" />
                </div>
                <button type="submit">Signup</button>
        </div>
    );
};

export default Signup;