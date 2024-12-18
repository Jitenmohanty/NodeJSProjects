import React, { useState } from "react";
import axios from "axios";

const WebhookUI = () => {
  const [webhookPayload, setWebhookPayload] = useState(`{
  "status": 200,
  "order_info": {
    "order_id": "collect_id/transaction_id",
    "order_amount": 2000,
    "transaction_amount": 2200,
    "gateway": "PhonePe",
    "bank_reference": "YESBNK222"
  }
}`);
  const [response, setResponse] = useState("");
  const [logs, setLogs] = useState([]);

  const handleSendWebhook = async () => {
    try {
      const parsedPayload = JSON.parse(webhookPayload); // Parse JSON input
      const res = await axios.post("/api/transactions/webhook/status-update", parsedPayload);
      setResponse(JSON.stringify(res.data, null, 2)); // Format response for display
      setLogs((prevLogs) => [...prevLogs, { payload: parsedPayload, response: res.data }]);
    } catch (error) {
      setResponse(error.message);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Webhook Simulator</h1>

      {/* Webhook Payload Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Webhook Payload:</label>
        <textarea
          value={webhookPayload}
          onChange={(e) => setWebhookPayload(e.target.value)}
          rows="8"
          className="w-full p-2 border rounded"
        ></textarea>
      </div>

      {/* Send Webhook Button */}
      <button
        onClick={handleSendWebhook}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send Webhook
      </button>

      {/* Webhook Response */}
      <div className="mt-6">
        <h2 className="text-xl font-medium mb-2">Webhook Response:</h2>
        <pre className="bg-white p-4 border rounded overflow-auto">{response}</pre>
      </div>

      {/* Logs Section */}
      <div className="mt-6">
        <h2 className="text-xl font-medium mb-2">Webhook Logs:</h2>
        <div className="bg-white p-4 border rounded overflow-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>Payload:</strong> {JSON.stringify(log.payload, null, 2)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Response:</strong> {JSON.stringify(log.response, null, 2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebhookUI;
