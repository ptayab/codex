import React, { useEffect, useState } from "react";

function Userlist() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch the list of users from the backend when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/users");
                const userData = await response.json();
                setUsers(userData);
            } catch (error) {
                console.error("Error fetching users:", error.message);
            }
        };

        fetchUsers();
    }, []);


    const deleteUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            console.log(data);
            setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error.message);
        }
    };

    return (
        <div>
            <h2>List of Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <strong>{user.username}</strong> - {user.email}
                        <button onClick={() => deleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Userlist;
