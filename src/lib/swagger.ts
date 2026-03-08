import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Book Manager API',
      version: '1.0.0',
      description:
        'A RESTful API for managing your personal book collection. Supports CRUD operations, filtering, and user authentication via JWT cookies.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token stored in httpOnly cookie',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            message: { type: 'string' },
            errors: { type: 'object' },
          },
        },
        Book: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            title: { type: 'string' },
            author: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            status: {
              type: 'string',
              enum: ['want-to-read', 'reading', 'completed'],
            },
            notes: { type: 'string' },
            coverColor: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateBookInput: {
          type: 'object',
          required: ['title', 'author'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              example: 'The Great Gatsby',
            },
            author: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              example: 'F. Scott Fitzgerald',
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['fiction', 'classic'],
            },
            status: {
              type: 'string',
              enum: ['want-to-read', 'reading', 'completed'],
              default: 'want-to-read',
            },
            notes: {
              type: 'string',
              maxLength: 2000,
              example: 'A masterpiece of American literature',
            },
          },
        },
        UpdateBookInput: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 200 },
            author: { type: 'string', minLength: 1, maxLength: 100 },
            tags: { type: 'array', items: { type: 'string' } },
            status: {
              type: 'string',
              enum: ['want-to-read', 'reading', 'completed'],
            },
            notes: { type: 'string', maxLength: 2000 },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Books', description: 'Book management endpoints' },
    ],
  },
  apis: ['./src/app/api/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
