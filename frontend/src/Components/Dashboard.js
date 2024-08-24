import React,{useEffect, useState} from 'react'
import './Dashboard.css';
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    if(!isLoggedIn){
        navigate("/login");
    }
    return (
        <>
            <div className="dashCont">
                <div onClick={() => navigate('/newaccount')}>
                    New Account
                </div>
                <div onClick={() => navigate('/accounts')}>
                    List Accounts
                </div>
                <div onClick={() => navigate('/history')} >
                    Transactions History
                </div>
                <div onClick={() => navigate('/transfer')}>
                    Fund Transfer
                </div>
            </div>
        </>
        
  )
}
