// pages/TransactionDetailsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionTable from "../components/TransactionTable";
import SchoolDropdown from "../components/SchoolDropdown";

const TransactionDetailsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");

  useEffect(() => {
    // Fetch list of schools for the dropdown
    const fetchSchools = async () => {
      try {
        const response = await axios.get("/api/transactions/schools");
        setSchools(response.data.data);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      const fetchTransactions = async () => {
        try {
          const response = await axios.get(`/api/transactions/school/${selectedSchool}`);
          setTransactions(response.data.data);
        } catch (error) {
          console.error("Error fetching school transactions:", error);
        }
      };

      fetchTransactions();
    }
  }, [selectedSchool]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transaction Details by School</h2>
      <SchoolDropdown schools={schools} onSelect={setSelectedSchool} />
      {selectedSchool && <TransactionTable transactions={transactions} />}
    </div>
  );
};

export default TransactionDetailsPage;
