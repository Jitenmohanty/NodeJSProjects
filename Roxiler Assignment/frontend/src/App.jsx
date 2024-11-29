import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import Dropdown from "./components/Dropdown";
import TransactionsTable from "./components/TransactionsTable";
import StatisticsAndBarChart from "./components/StatisticsAndBarChart";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Debounced Fetch Transactions
  const fetchTransactions = debounce(async () => {
    try {
      const response = await axios.get("/api/transactions", {
        params: { month, year, search, page },
      });
      setTransactions(response.data.transactions);
      setTotalPages(Math.ceil(response.data.total / 10)); // Assuming 10 per page
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  }, 500);

  // Fetch Statistics
  const fetchStatistics = async () => {
    try {
      const response = await axios.get("/api/statistics", {
        params: { month, year },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics", error);
    }
  };

  // Fetch Bar Chart Data
  const fetchBarChartData = async () => {
    try {
      const response = await axios.get("/api/bar-chart", {
        params: { month, year },
      });
      const labels = response.data.map((range) => range._id);
      const values = response.data.map((range) => range.count);

      setBarChartData({
        labels: labels.length > 0 ? labels : ["No Data"],
        datasets: [
          {
            label: "Number of Items",
            data: labels.length > 0 ? values : [0],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching bar chart data", error);
    }
  };

  // Fetch Data on Dependencies Change
  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
  }, [month, year, search, page]);

  return (
    <div className="container mx-auto p-4">
      {/* Dropdown for Year and Month */}
      <Dropdown
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
      />

      {/* Search Box */}
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Transactions Table */}
      <TransactionsTable
        transactions={transactions}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />

      {/* Statistics and Bar Chart */}
      <StatisticsAndBarChart
        statistics={statistics}
        barChartData={barChartData}
      />
    </div>
  );
};

export default App;
