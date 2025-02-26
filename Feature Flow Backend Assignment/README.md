# Feature Flag Management API

A RESTful API built with Node.js and Express.js to manage feature flags dynamically. This API supports CRUD operations for feature flags and includes JWT-based authentication.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete feature flags.
- **Authentication**: Secure API endpoints using JWT authentication.
- **Database**: Persistent storage using MongoDB.
- **Role-Based Access Control (Optional)**: Restrict certain operations to admin users.
- **Unit Tests**: Test cases for API endpoints (optional).

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Testing**: Jest (optional)
- **Deployment**: Render/Heroku/Vercel (optional)

## API Endpoints

| Method | Endpoint           | Description                          | Authentication Required |
|--------|--------------------|--------------------------------------|-------------------------|
| POST   | `/api/flags`       | Create a new feature flag            | Yes                     |
| GET    | `/api/flags`       | List all feature flags               | Yes                     |
| GET    | `/api/flags/:id`   | Retrieve a specific feature flag     | Yes                     |
| PUT    | `/api/flags/:id`   | Update a feature flag                | Yes                     |
| DELETE | `/api/flags/:id`   | Delete a feature flag                | Yes                     |

## Data Model

Each feature flag has the following attributes:

- `id` (Auto-generated UUID)
- `name` (Unique, required)
- `description` (Optional)
- `isEnabled` (Boolean, default: `false`)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Postman (for API testing)

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/feature-flag-api.git
   cd feature-flag-api

   Install Dependencies:

npm install
Set Up Environment Variables:
Create a .env file in the root directory and add the following:

PORT=3000
MONGODB_URI=mongodb://localhost:27017/feature-flags
JWT_SECRET=your_jwt_secret_key
Run the Application:

npm start
The API will be available at http://localhost:3000.

Run Tests (Optional):

npm test
Authentication
To access the API, you need to authenticate using a JWT token. Here's how:

Generate a JWT Token:

Use a tool like Postman to send a POST request to your authentication endpoint (if implemented).

Include the token in the Authorization header for subsequent requests:

Authorization: Bearer <your_jwt_token>
Example Requests
Create a Feature Flag
Request:

POST /api/flags
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "name": "new-feature",
  "description": "This is a new feature",
  "isEnabled": true
}
Response:

json
```bash
{
  "id": "12345",
  "name": "new-feature",
  "description": "This is a new feature",
  "isEnabled": true,
  "createdAt": "2023-10-01T12:00:00Z",
  "updatedAt": "2023-10-01T12:00:00Z"
}
List All Feature Flags
Request:

GET /api/flags
Authorization: Bearer <your_jwt_token>
Response:

json
[
  {
    "id": "12345",
    "name": "new-feature",
    "description": "This is a new feature",
    "isEnabled": true,
    "createdAt": "2023-10-01T12:00:00Z",
    "updatedAt": "2023-10-01T12:00:00Z"
  }
]