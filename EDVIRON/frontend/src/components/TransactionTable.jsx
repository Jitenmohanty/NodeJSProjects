import React, { useState } from "react";
import axios from "axios";

const TransactionTable = ({ transactions, onUpdate }) => {
  const [updating, setUpdating] = useState(null);

  // Function to handle status update
  const handleStatusUpdate = async (collect_id, newStatus) => {
    setUpdating(collect_id); // Show loading indicator for the row being updated
    try {
      const response = await axios.post("/api/transactions/manual-update", {
        collect_id,
        newStatus,
      });

      console.log("Transaction updated:", response.data);
      // Call onUpdate to refresh the table after successful update
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    } finally {
      setUpdating(null); // Remove loading indicator
    }
  };

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Collect ID</th>
          <th className="p-2 border">School ID</th>
          <th className="p-2 border">Gateway</th>
          <th className="p-2 border">Order Amount</th>
          <th className="p-2 border">Transaction Amount</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Custom Order ID</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.collect_id} className="text-center">
            <td className="p-2 border">{t.collect_id}</td>
            <td className="p-2 border">{t.school_id}</td>
            <td className="p-2 border">{t.gateway}</td>
            <td className="p-2 border">{t.order_amount}</td>
            <td className="p-2 border">{t.transaction_amount}</td>
            <td className="p-2 border">{t.status}</td>
            <td className="p-2 border">{t.custom_order_id}</td>
            <td className="p-2 border">
              <select
                onChange={(e) => handleStatusUpdate(t.collect_id, e.target.value)}
                disabled={updating === t.collect_id}
                className="p-1 border rounded"
                defaultValue={t.status}
              >
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              {updating === t.collect_id && <span className="ml-2">Updating...</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
