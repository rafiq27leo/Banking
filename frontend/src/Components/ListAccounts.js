import React, { useEffect, useState } from 'react'
import './ListAccount.css';

export const ListAccounts = () => {
  const [accounts, setAccountsData] = useState(null);
  const [searchValue, setSerachValue] = useState("");

  useEffect(() => {
    const fetchData = async() =>{
      const response = await fetch("http://localhost:8050/api/accounts");
      if(response.ok){
        const result = await response.json()
        setAccountsData(result);
      }
    }
  
    fetchData();

  },[]);

  return (
    <>
      <div className='padding-top-100'>
          <form>
              <h3 className='header-module-title'>List Accounts</h3>
              <div className='list-account-details'>
                  <p className='header-module-title filter-label-p'>Filter by :</p>
                  <input type="text" name="searchfield" placeholder='Search by Name, Acc No, Balance'
                    value={searchValue} onChange={(e) => setSerachValue(e.target.value)} />
              </div>
              <div className='renderDataHldrCls'>
              
              <table className="table">
                  <thead className="thead">
                      <tr className="trHead">
                          {accounts && Object.keys(accounts[0]).map((item, index) => (
                              <th className="th" key={index}>
                                  {item}
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody className="tbody">
                      {accounts && accounts.map((obj, index) => (
                          <tr className="trBody" key={index}>
                              {accounts && Object.keys(accounts[0]).map((item, index) => {
                                  const value = obj[item];
                                  return (
                                      <td className="td" key={index}>
                                          {value}
                                      </td>
                                  );
                              })}
                          </tr>
                      ))}
                  </tbody>
              </table>
                
              </div>
          </form>
      </div>
    </>
  )
}
