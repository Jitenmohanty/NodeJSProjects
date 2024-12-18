// pages/TransactionsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionTable from "../components/TransactionTable";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  console.log(status)
  console.log(currentPage)
  console.log(totalPages)
  console.log(dateRange)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/transactions/", {
          params: {
            status,
            date: dateRange,
            page: currentPage,
          },
        });
        setTransactions(response.data.data);
        setTotalPages(response.data.totalPages);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [status, dateRange, currentPage]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transactions Overview</h2>
      <Filters setStatus={setStatus} setDateRange={setDateRange} />
      <TransactionTable transactions={transactions} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TransactionsPage;
