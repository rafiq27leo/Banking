import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";


export const NewAccount = () => {
    const [accountNumber, setAccountNumber] = useState("")

    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [lineone, setLineOne] = useState("")
    const [linetwo, setLineTwo] = useState("")
    const [balance, setBalance] = useState("")

    let navigate = useNavigate();
    
    const getFormatedAccountNumber = () => {
        setAccountNumber("BS" + Math.floor(Math.pow(10, 8 - 1) + Math.random() * 9 * Math.pow(10, 8 - 1)));   
        setPassword(Math.floor(Math.pow(10, 8 - 1) + Math.random() * 9 * Math.pow(10, 8 - 1)));   
    }



    const handleClearForm = () => {
        setFName("");
        setLName("");
        setEmail("");
        setPassword("");
        setMobile("");
        setLineOne("");
        setLineTwo("");
        setBalance("");

    }
    const handleAccountCreate = (e) =>{
        e.preventDefault();
        const data = {
            accountNumber: accountNumber,
            fullName: fname + " " +  lname,
            fname:fname,
            lname:lname,
            email:email,
            password:password,
            mobile:mobile,
            address: lineone + "," + linetwo,
            balance: balance,
            status:"Active"
        }
        
        if(data && data.accountNumber && data.fullName && data.mobile && data.address && data.balance !== ""){
            axios.post("http://localhost:8050/api/accounts", data)
            .then(res => {
                alert("Account Created Successfully, \n Account Details will be send to the Mail Address (Feature Implementation)");
                handleClearForm();
                navigate("/accounts");
            })
            .catch((err) => console.log(err));
        }
        setTimeout(() =>{
            
        },1000)
        
       
    }

    useEffect(() => {
        getFormatedAccountNumber();
    },[]);
    
  return (
    <>
        <div className='padding-top-80'>
            <h3 className='header-module-title'>New Savings Account</h3>
            <form className="new-acct-form-hldr" onClick={handleAccountCreate}>
                <div className='container'>
                    <div className='col-md-12 new-acct-form'>
                        <label>Account Number : {accountNumber}</label>
                    </div>
                    <div className='col-md-12 new-acct-form'>
                        <div className='col-md-6 new-acct-form-field'>
                            <div className='form-group'>
                                <label>First Name </label>
                                <input type="text" name="fname" placeholder='First Name' value={fname} className='form-control' 
                                onChange={(e) => setFName(e.target.value)}/>
                            </div>
                        </div>
                        <div className='col-md-6 new-acct-form-field'>
                            <div className='form-group'>
                                <label>Last Name</label>
                                <input type="text" name="lname" placeholder='Last Name' value={lname} className='form-control' 
                                onChange={(e) => setLName(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-12 new-acct-form'>
                        <div className='col-md-6 new-acct-form-field'>
                            <div className='form-group'>
                                <label>Address Line 1</label>
                                <input type="text" name="lineone" placeholder='Line One' value={lineone} className='form-control' 
                                onChange={(e) => setLineOne(e.target.value)}/>
                            </div>
                        </div>
                        <div className='col-md-6 new-acct-form-field'>
                            <div className='form-group'>
                                <label>Address Line 2</label>
                                <input type="text" name="linetwo" placeholder='Line Two' value={linetwo} className='form-control' 
                                onChange={(e) => setLineTwo(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-12 new-acct-form'>
                        <div className='col-md-6 new-acct-form-field'>
                            <div className='form-group'>
                                <label>Email</label>
                                <input type="email" name="email" placeholder='Email' value={email} className='form-control' 
                                onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                        </div>
                        <div className='col-md-6 new-acct-form-field'>
                            <div className='form-group'>
                                <label>Password</label>
                                <input type="password" name="password" placeholder='Password' value={password} className='form-control' 
                                onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-12 new-acct-form'>
                        <div className='col-md-6 new-acct-form-field'>
                            <div className='form-group'>
                                <label>Mobile</label>
                                <input type="number" name="mobile" placeholder='Mobile' value={mobile} className='form-control' 
                                onChange={(e) => setMobile(e.target.value)}/>
                            </div>
                        </div>
                        <div className='col-md-6 new-acct-form-field'>
                            <div className='form-group'>
                                <label>Balance</label>
                                <input type="text" name="initial_balance" placeholder='Initial Deposit' value={balance} className='form-control' 
                                onChange={(e) => setBalance(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <button className='btn btn-primary btn-block' style={{"display":"flex"}}>Create</button>
                  </div>  
            </form>
        </div>
    </>
  )
}
