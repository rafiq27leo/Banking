import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";

export const FundTranfer = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [userAccountNumber, setUserNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountDetails, setAccountDetails] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [fullName, setFullname] = useState("");

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const email = localStorage.getItem("user.email");
        const response = await axios.get("http://localhost:8050/api/accounts", {
          params: { email },
        });
        
        const filterData = response.data.filter(account => account.email === localStorage.getItem("user.email"))
        
        setAccountDetails(response.data);
        setFullname(filterData[0].fullName);
        setBalanceAmount(filterData[0].balance);
        setUserNumber(filterData[0].accountNumber)
      } catch (error) {
        console.error("Failed to fetch account details", error);
      }
    };

    fetchAccountDetails();
  }, []);

  const handleFundTransfer = async (e) => {
    e.preventDefault();
    const sender_account = userAccountNumber;
    const balance = balanceAmount;
    const data = {
      sender_account: sender_account,
      accountNumber: accountNumber,
      balance: balance,
      description: description,
      amount: amount,
      date: new Date(),
    };
    console.log(data);
    // if(data && data.sender_account && data.accountNumber && data.description && data.amount !== ""){
    try {
      if (
        data &&
        data.sender_account &&
        data.accountNumber &&
        data.description &&
        data.amount !== ""
      ) {
        const transferResult = await axios.post(
          "http://localhost:8050/api/transfer",
          data
        );
        setBalanceAmount(transferResult.data.fromAccountBalance);
        alert(transferResult.data.message);
      } else {
        alert("Please fill the fields");
      }
    } catch (error) {
      console.log("Transfer failed. Please try again.");
      console.error("Transfer failed", error);
    }
  };

  return (
    <>
      <div className="padding-top-80">
        <h3 className="header-module-title">Fund Transfer</h3>
        <div className="userDetailsHolder">
          <h5 className="userDetailsinfo">Welcome: {fullName}</h5>
        </div>
        <form className="new-transfer-form-hldr" onSubmit={handleFundTransfer}>
          <div>
            <p>
              Account Number: {userAccountNumber}
            </p>
            <p>Balance: {parseFloat(balanceAmount).toFixed(2)}</p>
          </div>

          <div className="container">
            <div className="col-md-12 new-acct-form">
              <div className="col-md-12 new-acct-form-field">
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="Account Number"
                    value={accountNumber}
                    className="form-control"
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-12 new-acct-form-field">
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="text"
                    name="amount"
                    placeholder="Amount"
                    value={amount}
                    className="form-control"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-12 new-acct-form-field">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="4"
                    name="description"
                    placeholder="Description"
                    value={description}
                    className="form-control"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ display: "flex" }}
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
