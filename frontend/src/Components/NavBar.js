import React,{useEffect, useState} from 'react'
import "../index.css"
import {Link} from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';


export const NavBar = () => {
  
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = async() =>{
    try{
        await axios.post("http://localhost:8050/api/logout", {},
        {
            withCredentials: true,
        });
        setIsLoggedIn(false);
        logout();
        localStorage.removeItem('user.email');
        alert("User Logged out");
        navigate("/login")

    }
    catch(error){
        console.log("Error while Logged out")
    }
}

  return (
      <nav className='navbar navbar-expand navbar-light fixed-top'>
        <div className='container'>
          <Link className='navbar-brand'>Banking System</Link>
          <div className='collapse navbar-collapse'>
            <ul className='navbar-nav ml-auto'>
              {!isAuthenticated ? (
              <>
                <li className='nav-item'>
                  <Link to="/login" className='nav-link'>Login</Link>
                </li>
                <li className='nav-item'>
                  <Link to="/register" className='nav-link'>Register</Link>
                </li>
              </>
              ) : (
              <>
                <li className='nav-item'>
                  <Link to="/newaccount" className='nav-link'>New Account</Link>
                </li>
                <li className='nav-item'>
                  <Link to="/accounts" className='nav-link'>Accounts</Link>
                </li>
                <li className='nav-item'>
                  <Link to="/transfer" className='nav-link'>Fund Tranfer</Link>
                </li>
                <li className='nav-item'>
                  <Link to="/history" className='nav-link'>Transaction History</Link>
                </li>
                <li className='nav-item'>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
        </div>
    </nav>
  )
}
