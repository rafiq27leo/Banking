const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:3000", // to allow requests from client
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8050;

// MongoDB Connnection

mongoose.connect("mongodb://127.0.0.1:27017/banking").then(() => {
    console.log("Connected to Database")
    app.listen(PORT, () => console.log('API is running on http://localhost:8050'));

}).catch((err) =>{
    console.log("Error while connecting to DB", err)
});

// Schema
// Users Schema
const userSchema = mongoose.Schema({
    name:String,
    email:String,
    mobile:Number,
    password:String
});

// New Account Schema
const accountSchema = mongoose.Schema({
  accountNumber:String,
  fullName:String,
  fname:String,
  lname:String,
  email:String,
  mobile:Number,
  password:String,
  address:String,
  balance:Number,
  status:String
});



const transactionsSchema = new mongoose.Schema({
  date: Date,
  amount: Number,
  description: String,
  type:String
});

const transactionSchema = new mongoose.Schema({
  transactions: [transactionsSchema],
});

const Account = mongoose.model('Accounts', accountSchema);

const User = mongoose.model('User', userSchema);

const Transactions = mongoose.model('Transactions', transactionSchema);


// Routes

app.post('/api/accounts', async (req,res) => {
    try{
        const { accountNumber,fullName,fname,lname, mobile,email,password,address,balance,status } = req.body;
       const hashedPassword = await bcrypt.hash(password.toString(), 10);
        const newAccount = new Account({accountNumber,fullName,fname,lname,email,password:hashedPassword, mobile,address,balance,status})
        await newAccount.save();
        res.status(201).send("Account Registered Successfully");
    }

    catch(error){
        console.log("Error while register", error)
    }
});


app.post("/api/login", async(req,res) =>{
  try{
    const { email,password } = req.body;
    const user = await Account.findOne({email});
    // console.log("Login Data",user)
    if(user && (await bcrypt.compare(password, user.password))){
      // console.log("INside Login")
      res.cookie('authToken', user._id.toString(), { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      // console.log(req.cookies.authToken);
      // res.cookie('userToken', user._id.toString(), {httpOnly:true});
      res.status(201).send("User LoggedIn Successfully");
    }
    else{
      // console.log("INside Invalid")

      res.status(401).send("Invaild Credentials");
    }
  }
  catch(err) {
    res.status(500).send("Error Registering User");
  };
})

app.post("/api/logout", (req,res) => {
    res.clearCookie('authToken');
    res.status(200).send("User Logout Successfully");
});

app.post('/api/register', async (req,res) => {
  try{
      const { name,email,mobile,password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({name,email,mobile,password:hashedPassword})
      await newUser.save();
      res.status(201).send("User Registered Successfully");
  }

  catch(error){
      console.log("Error while register", error)
  }
});

app.get('/api/accounts', async (req,res) => {
  try{
      const accounts = await Account.find({});
      res.status(200).send(accounts);
  }
  catch(error){
      res.status(500).send({message:error.message});
  }
});

app.put('/api/accounts/:accountNumber', async (req, res) => {
  try{
    const { 
      sender_account,
      account_number,
      balance,
      description,
      amount,
      date } = req.body;
    // if (balance >= amount) {
    //     balance -= amount;  
    // }

    const transactions = {
      description:description,
      amount:amount,
      date:date,
      type:"Credit"
    }
    console.log(transactions)
    const { accountNumber } = req.params;
    const account = await Account.find({accountNumber, accountNumber},
      {
        $set: {
          'transactions.$': transactions // Update the matched transaction
        }
      },
      { new: true, runValidators: true } 
    );
    if (account) {
      // console.log(account);
      
      console.log("Account updated")
    } else {
      res.status(404).json({ message: 'account not found' });
    }



  }
  catch(err){
    res.status(500).send({message:err.message});

  }
  
  // if (account.balance >= amount) {
  //   account.balance -= amount;
  //   // In a real system, you would also update the recipient's account
  //   res.sendStatus(200);
  // } else {
  //   res.status(400).json({ message: 'Insufficient funds' });
  // }
});