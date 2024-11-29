import React from "react";

const TransactionsTable = ({ transactions, page, totalPages, setPage }) => {
  return (
    <div>
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
              <td className="border p-2">
                {new Date(txn.dateOfSale).toDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div>
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
    </div>
  );
};

export default TransactionsTable;
