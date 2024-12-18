import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TransactionsPage from "./pages/TransactionsPage";
import TransactionDetailsPage from "./pages/TransactionDetailsPage";
import StatusCheckPage from "./pages/StatusCheckPage";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<TransactionsPage />} />
          <Route path="/details" element={<TransactionDetailsPage />} />
          <Route path="/status" element={<StatusCheckPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
