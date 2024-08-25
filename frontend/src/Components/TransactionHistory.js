import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListAccount.css"; // Ensure you add the necessary styles for color-coding
import moment from "moment";

export const TransactionHistory = () => {
  const [transactions, setAccountsTransactions] = useState(null);
  const [fullName, setFullname] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("user.email");
      try {
        const response = await axios.get(
          `http://localhost:8050/api/transactions/${email}`
        );
        if (response.status === 200) {
          setFullname(response.data[0].fullName)
          setBalanceAmount(response.data[0].balance);
          setAccountsTransactions(response.data[0]?.transactions || []);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="padding-top-100">
        <h3 className="header-module-title">Transaction History</h3>
        <div className="userDetailsHolder">
          <h5 className="userDetailsinfo">Welcome: {fullName}</h5>
          <h5 className="userDetailsinfo">Balance: {balanceAmount}</h5>
        </div>
        
        <div className="renderDataHldrCls">
          <table className="table">
            <thead className="thead">
              <tr className="trHead">
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions &&
                transactions.map((item, index) => (
                  <tr
                    key={index}
                    className={
                      item.type === "Credit" ? "credit-row" : "debit-row"
                    }
                  >
                    <td>{item.type}</td>
                    <td>{item.description}</td>
                    <td
                      className={
                        item.type === "Credit"
                          ? "credit-amount"
                          : "debit-amount"
                      }
                    >
                      {item.amount}
                    </td>
                    <td>{moment(item.date).format("DD/MM/YYYY hh:mm:ss a")}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
