import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyTransfer = () => {
  const [accountDetails, setAccountDetails] = useState(null);
  const [userAccountNumber, setUserNumber] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("")
  const [currencies, setCurrencies] = useState(['USD', 'GBP', 'EUR']);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [convertedAmt, setConvertedAmt] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  const [userCurrency, setUserCurrency] = useState('USD'); // Assuming user currency is USD default
  const [fullName, setFullname] = useState("");

 
  useEffect(() => {
    const fetchAccountDetails = async () => {
    try {
        const email = localStorage.getItem('user.email');
        const response = await axios.get('http://localhost:8050/api/accounts', {
          params: { email }
        });
        setAccountDetails(response.data);
        const filterData = response.data.filter(account => account.email === localStorage.getItem("user.email"))
        setFullname(filterData[0].fullName);
        setBalanceAmount(filterData[0].balance);
        setUserNumber(filterData[0].accountNumber)
    } catch (error) {
        console.error('Failed to fetch account details', error);
    }
    };

    fetchAccountDetails();
}, []);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/b8df06ab20f1cc9122bd84b7/latest/${userCurrency}`, {
          params: {
            base: userCurrency,
            symbols: currencies.join(','),
            access_key: 'b8df06ab20f1cc9122bd84b7'
          }
        });
        setExchangeRates(response.data.conversion_rates || {}); // Ensure rates is defined
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, [userCurrency, currencies]);

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    calculateConvertedAmount(amount, newCurrency);
  };

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
  };

  const calculateConvertedAmount = (amount, currency) => {
    let convertedAmount = parseFloat(amount);
    if (!isNaN(convertedAmount) && exchangeRates[currency]) {
      if (userCurrency !== currency) {
        const rate = exchangeRates[currency];
        convertedAmount = convertedAmount * rate * 0.99; // Apply spread of 0.01
      }
      setConvertedAmt(convertedAmount.toFixed(2));
    } else {
      setConvertedAmt('');
      if (!exchangeRates[currency]) {
        alert('Error: Exchange rate not available for selected currency.');
      }
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const sender_account = userAccountNumber;
    console.log(amount,accountNumber, accountDetails[0].accountNumber);
    const data = {
        sender_account:sender_account,
        accountNumber:accountNumber,
        sender_amount:amount,
        description:description,
        amount:convertedAmt,
        date: new Date()

    }
    try {
        if(data && data.sender_account && data.accountNumber && data.description && data.amount !== ""){
          const transferResult = await axios.post('http://localhost:8050/api/currency-transfer', data);
            handleClearForm();
            alert(transferResult.data.message);
            setBalanceAmount(transferResult.data.fromAccountBalance)
        }
        else{
              alert("Please fill the fields");
        }
        
    } 
    catch (error) 
    {
        console.log('Transfer failed. Please try again.');
        console.error('Transfer failed', error);
    }
  }

  const handleClearForm = () =>{
    setAccountNumber("")
    setAmount("")
    setConvertedAmt("")
    setDescription("")
    setSelectedCurrency("USD")
  } 

  return (
    <>
      <div className='padding-top-80'>
        <h3 className='header-module-title'>Currency Transfer</h3>
        <div className="userDetailsHolder">
          <h5 className="userDetailsinfo">Welcome: {fullName}</h5>
        </div>
        <form className="new-transfer-form-hldr new-currencytransfer-form-hldr" onSubmit={handleTransfer}>
        <div>
            <p>Account Number: {userAccountNumber}</p>
            <p>Balance: {parseFloat(balanceAmount).toFixed(2)}</p>
        </div>
        <div className='container'>
          <div className='col-md-12 new-acct-form'>
            <div className='col-md-6 new-acct-form-field'>
              <div className='form-group'>
                <label>Account Number</label>
                <input
                  type="text"
                  placeholder="Account Number"
                  className='form-control'
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
            </div>
            
            <div className='col-md-6 new-acct-form-field'>
              <div className='form-group'>
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="Amount"
                  className='form-control'
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
            </div>
            </div>
            <div className='col-md-12 new-acct-form'>
            <div className='col-md-6 new-acct-form-field'>
              <div className='form-group'>
                <label>Select Currency</label>
                <select
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  className='form-control'
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-md-6 new-acct-form-field'>
              <div className='form-group'>
                <label>Converted Amount</label>
                <input
                  type="number"
                  readOnly
                  placeholder="Converted Amount"
                  className='form-control'
                  value={convertedAmt}
                />
              </div>
            </div>
            <div className='col-md-12 new-acct-form-field'>
              <div className='form-group'>
                <label>Description</label>
                <textarea
                  rows="4"
                  name="description"
                  placeholder='Description'
                  value={description}
                  className='form-control'
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
          <button type="submit" className='btn btn-primary btn-block' style={{ display: "flex" }}>Transfer</button>
        </form>
      </div>
    </>
  );
};

export default CurrencyTransfer;
