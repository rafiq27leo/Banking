const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
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

mongoose
  .connect("mongodb://127.0.0.1:27017/banking")
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () =>
      console.log("API is running on http://localhost:8050")
    );
  })
  .catch((err) => {
    console.log("Error while connecting to DB", err);
  });

// Schema

// Users Schema
const userSchema = mongoose.Schema({
  name: String,
  email: String,
  mobile: Number,
  password: String,
});

const transactionSchema = mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    description: String,
    type: { type: String, enum: ["credit", "debit"], required: true },
  },
  { _id: false }
);

// New Account Schema
const accountSchema = mongoose.Schema({
  accountNumber: String,
  fullName: String,
  fname: String,
  lname: String,
  email: String,
  mobile: Number,
  password: String,
  dob: String,
  address: String,
  status: String,
  balance: { type: Number, required: true, default: 0 },
  date: String,
  role:String,
  transactions: [transactionSchema],
});

const Account = mongoose.model("Accounts", accountSchema);

const User = mongoose.model("User", userSchema);

// Routes

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Account.findOne({ email });
    // console.log("Login Data",user)
    if (user && (await bcrypt.compare(password, user.password))) {
      res.cookie("authToken", user._id.toString(), {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(201).send("User LoggedIn Successfully");
    } else {
      res.status(401).send("Invaild Credentials");
    }
  } catch (err) {
    res.status(500).send("Error Registering User");
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).send("User Logout Successfully");
});



app.post("/api/register", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = new Account({
      accountNumber:"BS10000000",
      fullName:name,
      fname: name,
      lname: name,
      mobile:mobile,
      email:email,
      password: hashedPassword,
      dob:"12/12/1990",
      address:"",
      balance:0,
      status:"Active",
      role:"admin",
      transactions:[],
    });
    // const newUser = new Account({ name, email, mobile, password: hashedPassword });
    // console.log(newAccount)
    // return;
    await newAccount.save();
    res.status(201).send("User Registered Successfully");
  } catch (error) {
    console.log("Error while register", error);
  }
});

app.post("/api/accounts", async (req, res) => {
  try {
    const {
      accountNumber,
      fullName,
      fname,
      lname,
      mobile,
      email,
      password,
      dob,
      address,
      balance,
      status
    } = req.body;

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    const transactions = [];
    transactions.push({
      type: "credit",
      amount: balance,
      description: "Initial Balance Credited",
      date: new Date(),
    });

    const newAccount = new Account({
      accountNumber,
      fullName,
      fname,
      lname,
      mobile,
      email,
      password: hashedPassword,
      dob,
      address,
      balance,
      status,
      transactions,
      role:"user"
    });
    // console.log(newAccount);

    await newAccount.save();
    res.status(201).send("Account Registered Successfully");
  } catch (error) {
    console.log("Error while register", error);
    res.status(500).send("Error while registering account");
  }
});

app.get("/api/accounts", async (req, res) => {
  try {
    const accounts = await Account.find({});
    res.status(200).send(accounts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post("/api/transfer", async (req, res) => {
  try {
    const { sender_account, accountNumber, description, amount, date } =
      req.body;

    if (!sender_account || !accountNumber || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const fromAccount = await Account.find({ accountNumber: sender_account });
    const toAccount = await Account.find({ accountNumber: accountNumber });
    // console.log(fromAccount)

    if (!fromAccount || !toAccount) throw new Error("Account(s) not found");
    if (fromAccount.balance < amount) throw new Error("Insufficient funds");

    fromAccount[0].transactions.push({
      type: "debit",
      amount,
      description,
      date: new Date(),
    });
    await fromAccount[0].save();

    fromAccount[0].balance =
      parseFloat(fromAccount[0].balance) - parseFloat(amount);
    // console.log(parseFloat(fromAccount[0].balance), " " , fromAccount[0].balance)
    await Account.findByIdAndUpdate(
      fromAccount[0]._id,
      { $set: { balance: fromAccount[0].balance } },
      { new: true } // Return the updated document
    );

    toAccount[0].transactions.push({
      type: "credit",
      amount,
      description:description,
      date: new Date(),
    });
    await toAccount[0].save();
    toAccount[0].balance =
      parseFloat(toAccount[0].balance) + parseFloat(amount);
    console.log(toAccount[0].balance);
    await Account.findByIdAndUpdate(
      toAccount[0]._id,
      { $set: { balance: toAccount[0].balance } },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Transfer successful",
      fromAccountBalance: fromAccount[0].balance,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.post("/api/currency-transfer", async (req, res) => {
  try {
    const { sender_account, accountNumber,sender_amount, description, amount, date } =
      req.body;
    
    if (!sender_account || !accountNumber || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const fromAccount = await Account.find({ accountNumber: sender_account });
    const toAccount = await Account.find({ accountNumber: accountNumber });
    // console.log(fromAccount)
    // return
    if (!fromAccount || !toAccount) throw new Error("Account(s) not found");
    if (fromAccount.balance < amount) throw new Error("Insufficient funds");

    fromAccount[0].transactions.push({
      type: "debit",
      amount: parseFloat(sender_amount),
      description,
      date: new Date(),
    });
    
    await fromAccount[0].save();

    fromAccount[0].balance =
      parseFloat(fromAccount[0].balance) - parseFloat(sender_amount);
    // console.log(parseFloat(fromAccount[0].balance), " " , fromAccount[0].balance)
    await Account.findByIdAndUpdate(
      fromAccount[0]._id,
      { $set: { balance: fromAccount[0].balance } },
      { new: true } // Return the updated document
    );

   

    toAccount[0].transactions.push({
      type: "credit",
      description:description,
      amount: parseFloat(amount),
      date: new Date(),
    });
    await toAccount[0].save();

    console.log("***********hdgjsahgd********", toAccount[0])
    toAccount[0].balance =
      parseFloat(toAccount[0].balance) + parseFloat(amount);
    console.log(toAccount[0].balance);
    await Account.findByIdAndUpdate(
      toAccount[0]._id,
      { $set: { balance: toAccount[0].balance } },
      { new: true } // Return the updated document
    );
    // console.log("*******************", toAccount[0])
    // return;
    res.status(200).json({
      message: "Transfer successful",
      fromAccountBalance: fromAccount[0].balance,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


app.get("/api/transactions/:email", async (req, res) => {
  try {
    const accounts = await Account.find({ email: req.params.email });
    res.status(200).send(accounts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


app.get('/api/account', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).send({ message: 'Email parameter is required' });
    }

    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).send({ message: 'Account not found' });
    }

    res.send(account);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});
