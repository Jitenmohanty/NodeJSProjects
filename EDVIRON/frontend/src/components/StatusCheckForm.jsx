// components/StatusCheckForm.jsx
import React, { useState } from "react";

const StatusCheckForm = ({ onCheckStatus }) => {
  const [orderId, setOrderId] = useState("");

  return (
    <div className="p-4 border rounded">
      <input
        type="text"
        placeholder="Enter custom_order_id"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="p-2 border rounded mr-2"
      />
      <button
        onClick={() => onCheckStatus(orderId)}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Check Status
      </button>
    </div>
  );
};

export default StatusCheckForm;
