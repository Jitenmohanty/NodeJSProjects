// components/TransactionTable.jsx
import React from "react";

const TransactionTable = ({ transactions }) => {
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
