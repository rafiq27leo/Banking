import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const Registeration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const { logout } = useAuth();
  logout();

  const handleRegister = (e) => {
    e.preventDefault();
    const data = {
      name: name,
      email: email,
      mobile: mobile,
      password: password,
    };

    if (
      data &&
      data.name &&
      data.email &&
      data.mobile &&
      data.password !== ""
    ) {
      axios
        .post("http://localhost:8050/api/register", data)
        .then((res) => {
          alert("Register Successfully");
          handleClearForm();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleClearForm = () => {
    setName("");
    setEmail("");
    setMobile("");
    setPassword("");
  };

  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onClick={handleRegister}>
            <h3>Registeration</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                value={name}
                placeholder="Full Name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mobile</label>
              <input
                type="mobile"
                name="mobile"
                placeholder="Mobile"
                value={mobile}
                className="form-control"
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn btn-primary btn-block">Register</button>
          </form>
        </div>
      </div>
    </>
  );
};
