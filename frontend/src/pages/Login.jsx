import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function handleLogin() {

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

      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);

        navigate("/dashboard");
      } else {
        setError(data.message);
      }

    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="login-page">

      <div className="login-card">

        <h2>Login</h2>

        <p>Welcome Back!</p>

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
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        {error && <p className="error">{error}</p>}

        <button onClick={handleLogin}>Login</button>

        <span>
          Don't have an account?
          <Link to="/Register"> Register</Link>
        </span>

      </div>

    </div>
  );
}

export default Login;