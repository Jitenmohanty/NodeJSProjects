import React, { useState, useEffect } from "react";
import { useDebounce } from "../utils/useDebounce";

const Filters = ({
  setPayment,
  setTransactionAmount,
  setOrderAmount,
  setStatus,
  setDateRange,
}) => {
  const [orderAmountInput, setOrderAmountInput] = useState("");
  const [transactionAmountInput, setTransactionAmountInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  // Debounce the inputs
  const debouncedOrderAmount = useDebounce(orderAmountInput, 500);
  const debouncedTransactionAmount = useDebounce(transactionAmountInput, 500);
  const debouncedDate = useDebounce(dateInput, 500);

  // Update parent state with debounced values
  useEffect(() => {
    setOrderAmount(debouncedOrderAmount);
  }, [debouncedOrderAmount, setOrderAmount]);

  useEffect(() => {
    setTransactionAmount(debouncedTransactionAmount);
  }, [debouncedTransactionAmount, setTransactionAmount]);

  useEffect(() => {
    setDateRange(debouncedDate);
  }, [debouncedDate, setDateRange]);

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
      <select
        onChange={(e) => setPayment(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Payment</option>
        <option value="Stripe">Stripe</option>
        <option value="PhonePe">PhonePe</option>
        <option value="Paytm">Paytm</option>
        <option value="Gpay">Gpay</option>
      </select>

      <input
        type="number"
        placeholder="Order amount"
        value={orderAmountInput}
        onChange={(e) => setOrderAmountInput(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Transaction amount"
        value={transactionAmountInput}
        onChange={(e) => setTransactionAmountInput(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="date"
        value={dateInput}
        onChange={(e) => setDateInput(e.target.value)}
        className="p-2 border rounded"
      />
    </div>
  );
};

export default Filters;
