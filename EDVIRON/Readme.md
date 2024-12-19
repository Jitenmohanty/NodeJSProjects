# School Payment and Dashboard Application Backend

## Project Overview
This backend service is built using NestJS and MongoDB to manage students, fees, and payment transactions. It includes functionalities such as fetching transactions, checking transaction status, and updating transaction records through APIs and webhooks.

---

## Features

### Project Setup
1. **Node.js Project Initialization**:
   - Framework: NestJS.
   - Database: MongoDB.

2. **Data Import**:
   - Import dummy data from two attached CSV files into MongoDB.

### API Endpoints
1. **Fetch All Transactions**:
   - Retrieve transaction records with the following details:
     - `collect_id`
     - `school_id`
     - `gateway`
     - `order_amount`
     - `transaction_amount`
     - `status`
     - `custom_order_id`

2. **Fetch Transactions by School**:
   - Retrieve all transaction details for a specific school using `school_id`.

3. **Transaction Status Check**:
   - Endpoint to retrieve the current status of a transaction using `custom_order_id`.

4. **Webhook for Status Updates**:
   - Webhook to receive and update the transaction status from the provided payload format:
     ```json
     {
         "status": 200,
         "order_info": {
             "order_id": "collect_id/transaction_id",
             "order_amount": 2000,
             "transaction_amount": 2200,
             "gateway": "PhonePe",
             "bank_reference": "YESBNK222"
         }
     }
     ```

5. **Manual Status Update**:
   - POST endpoint to allow manual updates of a transaction’s status.

6. **Payment API (Optional)**:
   - Implement a payments API to save transaction amounts and status in the database.
   - Redirect users to a payment page provided in the API response.

---

## Additional Details
- **API Documentation**:
  - Refer to [API Docs](https://documenter.getpostman.com/view/22738724/2sAY4viPQH) for endpoint details.

- **Authentication**:
  - pg key: `edvtest01`
  - school_id: `65b0e6293e9f76a9694d84b4`
  - API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2LCJpYXQiOjE3MTE2MjIyNzAsImV4cCI6MTc0MzE3OTg3MH0.Rye77Dp59GGxwCmwWekJHRj6edXWJnff9finjMhxKuw`

- **cURL Example**:
  ```bash
  curl -X POST \ 
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \ 
  -H "Content-Type: application/json" \ 
  -d '{
        "school_id": "65b0e6293e9f76a9694d84b4",
        "order_amount": 2000,
        "gateway": "PhonePe"
     }' \ 
  https://example.com/api/create-collect-request
  ```

---

## Project Setup Instructions

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   - Create a `.env` file in the root directory with the following:
     ```env
     MONGODB_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     PORT=3000
     ```

4. **Run Application**:
   ```bash
   npm run start
   ```

5. **Data Import**:
   - Use the provided script to import CSV data into MongoDB.

6. **API Testing**:
   - Use Postman or similar tools to test the APIs.

---

## Notes
- Ensure MongoDB is running before starting the application.
- Validate API payloads and responses for accurate data handling.
- Follow the provided API documentation closely for integration details.

---
