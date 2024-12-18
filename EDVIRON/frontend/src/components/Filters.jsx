// components/Filters.jsx
import React from "react";

const Filters = ({ setStatus, setDateRange }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <select
        onChange={(e) => setStatus(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">All Status</option>
        <option value="success">Success</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>
      <input
        type="date"
        onChange={(e) => setDateRange(e.target.value)}
        className="p-2 border rounded"
      />
    </div>
  );
};

export default Filters;
