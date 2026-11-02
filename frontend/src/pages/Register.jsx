import "../styles/register.css";
import { useState } from "react";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    async function handleRegister() {

        if (name === "") {
            setError("Name is required");
            return;
        }

        if (email === "") {
            setError("Email is required");
            return;
        }

        if (password === "") {
            setError("Password is required");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setError("");

        try {

            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            console.log(data);

        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="register-page">

            <div className="register-card">

                <h2>Create Account</h2>

                <p>Join HackTest Today!</p>

                <input
                    type="text"
                    placeholder="Enter Full Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError("");
                    }}
                />

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                />

                <input
                    type="password"
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                    }}
                />
                {error && <p className="error">{error}</p>}

                <button onClick={handleRegister}>Register</button>

            </div>

        </div>
    );
}


export default Register;
