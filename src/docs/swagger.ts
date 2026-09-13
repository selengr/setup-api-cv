export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'portfolio-api',
    version: '1.0.0',
    description: 'Personal portfolio / resume API. Phone OTP login, JWT, public profile by slug.',
  },
  servers: [{ url: 'http://localhost:4000' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register with name + Iranian phone',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'phone'],
                properties: {
                  name: { type: 'string', example: 'Reza Karbakhsh' },
                  phone: { type: 'string', example: '09121234567' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Created' } },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Request OTP login token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone'],
                properties: { phone: { type: 'string' } },
              },
            },
          },
        },
        responses: { '200': { description: 'OTP session token' } },
      },
    },
    '/api/auth/login/verify-phone': {
      post: {
        summary: 'Verify OTP and receive JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'code'],
                properties: {
                  token: { type: 'string', format: 'uuid' },
                  code: { type: 'string', example: '123456' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'User + JWT' } },
      },
    },
    '/api/cv/public/{slug}': {
      get: {
        summary: 'Public CV by slug (no auth)',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: { '200': { description: 'Public CV payload' } },
      },
    },
    '/api/cv/me': {
      get: {
        summary: 'Get my full CV (auth)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Owner CV' } },
      },
    },
    '/api/users/me': {
      get: {
        summary: 'Current user profile',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'User' } },
      },
    },
  },
};
