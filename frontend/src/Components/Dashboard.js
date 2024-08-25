import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

export const Dashboard = () => {
  const [userRole, setUserRole] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("user.email");
    if (email) {
      axios.get('http://localhost:8050/api/account', { params: { email } })
        .then(response => {
          setUserRole(response.data.role);
          localStorage.setItem("user.role", response.data.role);
        })
        .catch(err => {
          console.error(err.message);
        });
    } else {
      navigate("/login"); 
    }
  }, [navigate]);

  if (userRole === null) return <div>Loading...</div>;

  return (
    <div className="dashCont">
      {userRole === 'admin' && (
        <>
          <div onClick={() => navigate("/newaccount")}>New Account</div>
          <div onClick={() => navigate("/accounts")}>Accounts</div>
        </>
      )}
      <div onClick={() => navigate("/transfer")}>Fund Transfer</div>
      <div onClick={() => navigate("/history")}>Transactions History</div>
      <div onClick={() => navigate("/currency-transfer")}>Currency Transfer</div>
    </div>
  );
};
