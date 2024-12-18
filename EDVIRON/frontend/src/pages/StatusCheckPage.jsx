// pages/StatusCheckPage.jsx
import React, { useState } from "react";
import axios from "axios";
import StatusCheckForm from "../components/StatusCheckForm";

const StatusCheckPage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async (orderId) => {
    if (!orderId) return;
    console.log(orderId);
    setLoading(true);
    try {
      const response = await axios.get(`/api/transactions/check-status/${orderId}`);
      setStatus(response.data.data.status); // Access the nested `data` field
    } catch (error) {
      console.error("Error checking transaction status:", error);
      setStatus("Error retrieving status.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transaction Status Check</h2>
      <StatusCheckForm onCheckStatus={checkStatus} />
      {loading && <p className="mt-4">Loading...</p>}
      {status && (
        <p className="mt-4 font-semibold">
          Transaction Status: <span>{status}</span>
        </p>
      )}
    </div>
  );
};

export default StatusCheckPage;
