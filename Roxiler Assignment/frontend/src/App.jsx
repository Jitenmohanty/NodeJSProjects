import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import debounce from "lodash.debounce";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(new Date().getFullYear()); // Default to the current year
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Generate a list of years
  const years = Array.from({ length: 10 }, (_, i) => {
    const currentYear = new Date().getFullYear();
    return currentYear - i;
  });

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
      const response = await axios.get("/api/statistics", { params: { month, year } });
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics", error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get("/api/bar-chart", { params: { month, year } });
      if (Array.isArray(response.data) && response.data.length > 0) {
        const labels = response.data.map((range) => range._id);
        const values = response.data.map((range) => range.count);

        setBarChartData({
          labels,
          datasets: [
            {
              label: "Number of Items",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } else {
        setBarChartData({
          labels: ["No Data"],
          datasets: [
            {
              label: "No Data Available",
              data: [0],
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching bar chart data", error);
      setBarChartData({
        labels: ["Error"],
        datasets: [
          {
            label: "Error Fetching Data",
            data: [0],
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
        ],
      });
    }
  };

  // Fetch Data on Month, Year, or Search Change
  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
  }, [month, year, search, page]);

  return (
    <div className="container mx-auto p-4">
      {/* Year Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-bold">Select Year:</label>
        <select
          className="border p-2 rounded"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Month Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-bold">Select Month:</label>
        <select
          className="border p-2 rounded"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

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
      <table className="border-collapse border border-gray-300 w-full mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Sold</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id} className="hover:bg-gray-100">
              <td className="border p-2">{txn.title}</td>
              <td className="border p-2">{txn.description}</td>
              <td className="border p-2">${txn.price}</td>
              <td className="border p-2">{txn.sold ? "Yes" : "No"}</td>
              <td className="border p-2">{new Date(txn.dateOfSale).toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-bold">Total Sale Amount</h3>
          <p>${statistics.totalSaleAmount || 0}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-bold">Total Sold Items</h3>
          <p>{statistics.totalSoldItems || 0}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <h3 className="font-bold">Total Unsold Items</h3>
          <p>{statistics.totalUnsoldItems || 0}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-4">
        <h3 className="font-bold mb-2">Transactions Bar Chart</h3>
      </div>
    </div>
  );
};

export default App;
