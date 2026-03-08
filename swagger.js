const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Menu & Catalog Service API",
      version: "1.0.0",
      description: "API documentation for Menu & Catalog Microservice"
    },
    servers: [
      {
        url: "https://menu-service-production-048a.up.railway.app"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJsdoc(options);