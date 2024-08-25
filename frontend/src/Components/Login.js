// pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [email, setEmailData] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email, password };

    if (data.email && data.password) {
      try {
        await axios.post("http://localhost:8050/api/login", data, {
          withCredentials: true,
        });
        console.log("User LoggedIn Successfully");
        localStorage.setItem("user.email", data.email,"user.role",data.role);
        login();
        navigate("/dashboard");
        handleClearForm();
      } catch (err) {
        console.error("Login Error:", err);
      }
    }
  };

  const handleClearForm = () => {
    setEmailData("");
    setPassword("");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleLogin}>
          <h3>Login</h3>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              className="form-control"
              onChange={(e) => setEmailData(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-block btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
};
