import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CHAT APP API', // Title of the API documentation
      version: '1.0.0', // API version
      description: 'API documentation for the MERN-based Chat app that allows user authentication, messaging, group chats, and chatbot interactions.',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Define the API server URL
        description: 'Local server for development', // Description for the local server
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Define JWT as the authentication method
        },
      },
    },
    security: [{ bearerAuth: [] }], // This security setting applies to all endpoints that require authentication
  },
  apis: [
    './routes/swagger_doc/*.js', // Path to the Swagger documentation for route files
    './controllers/*.js', // Path to the controllers where endpoints are defined
    './models/swagger_doc/*.js', // Path to the model Swagger documentation
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
