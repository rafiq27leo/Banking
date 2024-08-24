import React, { useEffect, useState } from 'react'
import '../App.css'
import axios from 'axios';

export const FundTranfer = () => {
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [accountDetails, setAccountDetails] = useState(null);

    useEffect(() => {
        const fetchAccountDetails = async () => {
        try {
            const email = localStorage.getItem('user.email');
            const response = await await axios.get('http://localhost:8050/api/accounts', {
                params: { email }
              });
            setAccountDetails(response.data);
        } catch (error) {
            console.error('Failed to fetch account details', error);
        }
        };

        fetchAccountDetails();
    }, []);

    const handleFundTransfer = async (e) => {
        const sender_account = accountDetails[0].accountNumber;
        const balance = accountDetails[0].balance;
        console.log(amount,accountNumber, accountDetails[0].accountNumber);
        const data = {
            sender_account:sender_account,
            accountNumber:accountNumber,
            balance:balance,
            description:description,
            amount:amount,
            date: new Date()

        }
        e.preventDefault();
        console.log(data)
        try {
            await axios.put(`http://localhost:8050/api/accounts/${accountNumber}`, data);
            alert('Transfer successful!');
        } catch (error) 
        {
            console.log('Transfer failed. Please try again.');
            console.error('Transfer failed', error);
        }
    }

  return (
    <>
        <div className='padding-top-80'>
            <h3 className='header-module-title'>Fund Transfer</h3>
            <form className="new-transfer-form-hldr" onClick={handleFundTransfer}>
                <div>
                    <p>Account Number: {accountDetails && accountDetails[0].accountNumber}</p>
                    <p>Balance: ${accountDetails && accountDetails[0].balance}</p>
                </div>
                
                <div className='container'>
                    <div className='col-md-12 new-acct-form'>
                        <div className='col-md-12 new-acct-form-field'>
                            <div className='form-group'>
                                <label>Account Number</label>
                                <input type="text" name="accountNumber" placeholder='Account Number' value={accountNumber} className='form-control' 
                                onChange={(e) => setAccountNumber(e.target.value)}/>
                            </div>
                        </div>
                        <div className='col-md-12 new-acct-form-field'>
                            <div className='form-group'>
                                <label>Description</label>
                                <input type="text" name="description" placeholder='Description' value={description} className='form-control' 
                                onChange={(e) => setDescription(e.target.value)}/>
                            </div>
                        </div>
                        <div className='col-md-12 new-acct-form-field'>
                            <div className='form-group'>
                                <label>Amount</label>
                                <input type='text' name="amount" placeholder='Amount' value={amount} className='form-control'
                                onChange={(e) => setAmount(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <button className='btn btn-primary btn-block' style={{"display":"flex"}}>Transfer</button>

                </div>
            </form>   
        </div>
    </>
  )
}
