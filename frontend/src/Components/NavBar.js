// components/NavBar.js
import React, {useEffect,useState} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../index.css";

export const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null); 



  useEffect(() => {
    const email = localStorage.getItem("user.email");
    if (email) {
      axios.get('http://localhost:8050/api/account', { params: { email } })
        .then(response => {
          setUserRole(response.data.role);
          // localStorage.setItem("user.role", response.data.role);
        })
        .catch(err => {
          console.error(err.message);
        });
    }
  }, [navigate]);

  // if (userRole === null) return <div>Loading...</div>;


  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8050/api/logout",
        {},
        { withCredentials: true }
      );
      logout();
      alert("User Logged out");
      navigate("/login");
    } catch (error) {
      console.log("Error while Logging out");
    }
  };

  return (
    <nav className="navbar navbar-expand navbar-light fixed-top">
      <div className="container">
        <Link className="navbar-brand">Banking System</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            {!isAuthenticated ? (
              <>
              
                <li className="nav-item">
                  <Link to="/login" className={`nav-link nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className={`nav-link nav-item ${location.pathname === '/register' ? 'active' : ''}`}>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {userRole === 'admin' && (
                  <>

                <li className="nav-item">
                  <Link to="/newaccount" className={`nav-link nav-item ${location.pathname === '/newaccount' ? 'active' : ''}`}>
                    New Account
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/accounts" className={`nav-link nav-item ${location.pathname === '/accounts' ? 'active' : ''}`}>
                    Accounts
                  </Link>
                </li>
                  </>
                )}

                <li className="nav-item">
                  <Link to="/transfer" className={`nav-link nav-item ${location.pathname === '/transfer' ? 'active' : ''}`}>
                    Fund Transfer
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/history" className={`nav-link nav-item ${location.pathname === '/history' ? 'active' : ''}`}>
                    Transaction History
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/currency-transfer" className={`nav-link nav-item ${location.pathname === '/currency-transfer' ? 'active' : ''}`}>
                    Currency Transfer
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
