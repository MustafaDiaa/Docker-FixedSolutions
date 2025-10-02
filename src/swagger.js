const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookly API',
      version: '1.0.0',
      description: 'API documentation for Bookly',
    },
    servers: [
      { url: 'http://localhost:5000' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Book: {
          type: 'object',
          required: ['title', 'author', 'price'],
          properties: {
            title: { type: 'string', example: 'The Great Gatsby' },
            author: { type: 'string', example: 'F. Scott Fitzgerald' },
            description: { type: 'string', example: 'A classic novel' },
            price: { type: 'number', example: 19.99 },
            stock: { type: 'number', example: 10 },
            publishedDate: { type: 'string', format: 'date', example: '1925-04-10' },
            category: { type: 'string', example: 'Fiction' },
          },
        },
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: { type: 'string', example: '64f123abc456def789ghi012' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'hashedPassword123!' },
            role: { type: 'string', enum: ['user', 'subAdmin', 'rootAdmin'], example: 'user' },
            phone: { type: 'string', example: '+201234567890' },
            dateOfBirth: { type: 'string', format: 'date', example: '1990-05-15' },
            city: { type: 'string', example: 'Cairo' },
            address: { type: 'string', example: '123 Nile St' },
            lastOnline: { type: 'string', format: 'date-time', example: '2025-10-02T10:00:00Z' },
            booksBoughtAmount: { type: 'number', example: 5 },
            isEmailConfirmed: { type: 'boolean', example: true },
            refreshTokens: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  token: { type: 'string', example: 'jwt.refresh.token' },
                  createdAt: { type: 'string', format: 'date-time' },
                  ip: { type: 'string', example: '192.168.1.1' }
                }
              }
            }
          },
        },
        CartItem: {
          type: 'object',
          required: ['book', 'quantity'],
          properties: {
            book: { type: 'string', example: '64f123abc456def789ghi012' },
            quantity: { type: 'number', example: 2 },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            user: { type: 'string', example: '64f123abc456def789ghi012' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
        },
        Purchase: {
          type: 'object',
          properties: {
            user: { type: 'string', example: '64f123abc456def789ghi012' },
            book: { type: 'string', example: '64f123abc456def789ghi456' },
            quantity: { type: 'number', example: 1 },
            purchaseDate: { type: 'string', format: 'date-time', example: '2025-10-02T12:30:00Z' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
        },
      },
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  apis: [__dirname + '/routes/*.js'], // ensure correct path
};

module.exports = swaggerJsDoc(swaggerOptions);
