import React, { useEffect, useState } from "react";
import "./ListAccount.css";

export const ListAccounts = () => {
  const [accounts, setAccountsData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [balanceFilter, setBalanceFilter] = useState("");
  const [accountFilter, setAccountFilter] = useState("");
  const [fullName, setFullname] = useState("");

  // Fetch accounts data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8050/api/accounts");
        if (response.ok) {
          const result = await response.json();
          setAccountsData(result);
          const loggedInUser = result.filter((account) => account.email === localStorage.getItem("user.email"));
          setFullname(loggedInUser[0].fullName)
        } else {
          console.error("Failed to fetch accounts");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredAccounts = accounts.filter((account) => {
    const nameMatches = account.fullName
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const balanceMatches =
      balanceFilter === "" || account.balance >= parseFloat(balanceFilter);
    const accountMatches = account.accountNumber
      .toString()
      .includes(accountFilter);

    return nameMatches && balanceMatches && accountMatches;
  });

  return (
    <>
      <div className="padding-top-100">
        <form>
          <h3 className="header-module-title">List Accounts</h3>
          <div className="userDetailsHolder">
            <h5 className="userDetailsinfo">Welcome: {fullName}</h5>
          </div>
          <div className="list-account-details">
            <p className="header-module-title filter-label-p">Filter by :</p>
            <input
              type="text"
              name="searchfield"
              placeholder="Search by Name"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <input
              type="text"
              name="searchfield"
              placeholder="Search by Account"
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            />

            <input
              type="number"
              name="searchfield"
              placeholder="Search by Balance"
              value={balanceFilter}
              onChange={(e) => setBalanceFilter(e.target.value)}
            />
          </div>
          <div className="renderDataHldrCls">
            <table className="table">
              <thead className="thead">
                <tr className="trHead">
                  <th>Account Number</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts
                    .filter(
                      (account) =>
                        account.email !== localStorage.getItem("user.email")
                    )
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{item.accountNumber}</td>
                        <td>{item.fullName}</td>
                        <td>{item.email}</td>
                        <td>{item.mobile}</td>
                        <td>{item.address}</td>
                        <td>{parseFloat(item.balance).toFixed(2)}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6">No accounts found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </>
  );
};
