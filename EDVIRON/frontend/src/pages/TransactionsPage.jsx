// pages/TransactionsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionTable from "../components/TransactionTable";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Function to fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transactions/", {
        params: {
          payment,
          status,
          date: dateRange,
          page: currentPage,
          transactionAmount,
          orderAmount,
        },
      });
      setTransactions(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Effect to fetch transactions when filters or pagination change
  useEffect(() => {
    fetchTransactions();
  }, [status, dateRange, currentPage, payment, transactionAmount, orderAmount]);

  // Function to handle updates
  const onUpdate = () => {
    fetchTransactions(); // Refresh the transaction list
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transactions Overview</h2>
      <Filters
        setTransactionAmount={setTransactionAmount}
        setOrderAmount={setOrderAmount}
        setPayment={setPayment}
        setStatus={setStatus}
        setDateRange={setDateRange}
      />
      <TransactionTable onUpdate={onUpdate} transactions={transactions} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TransactionsPage;
