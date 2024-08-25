import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./Components/Dashboard";
import { FundTranfer } from "./Components/FundTranfer";
import { ListAccounts } from "./Components/ListAccounts";
import { Login } from "./Components/Login";
import { NavBar } from "./Components/NavBar";
import { NewAccount } from "./Components/NewAccount";
import { Registeration } from "./Components/Registeration";
import { TransactionHistory } from "./Components/TransactionHistory";
import { AuthProvider } from "./context/AuthContext";
import CurrencyTransfer from "./Components/CurrencyTransfer";

function App() {
  return (
    <div className="App">
      <>
        <AuthProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registeration />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/newaccount" element={<NewAccount />} />
              <Route path="/accounts" element={<ListAccounts />} />
              <Route path="/transfer" element={<FundTranfer />} />
              <Route path="/history" element={<TransactionHistory />} />
              <Route path="/currency-transfer" element={<CurrencyTransfer />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </>
    </div>
  );
}

export default App;
