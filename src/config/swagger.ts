import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './config';
import { OpenAPIV3 } from 'openapi-types';

const swaggerDefinition: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Pleroma Backend API',
    version: '1.0.0',
    description: 'Documentación de la API de Pleroma Backend',
  },
  servers: [
    {
      url: config.apiUrl,
      description: config.nodeEnvironment === 'production' ? 'Production server' : 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'auth_token',
      },
    },
    schemas: {
      UserRegister: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 5, maxLength: 15, example: 'usuario123' },
          email: { type: 'string', format: 'email' },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 20,
            pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!%*?&])([A-Za-zd$@$!%*?&]|[^ ])/',
            example: '311eU54$',
          },
        },
      },
      UserLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 20,
            pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!%*?&])([A-Za-zd$@$!%*?&]|[^ ])/',
            example: '311eU54$',
          },
        },
      },
      UserUpdate: {
        type: 'object',
        properties: {
          username: { type: 'string', minLength: 5, maxLength: 15, example: 'usuario123' },
          email: { type: 'string', format: 'email' },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 20,
            pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!%*?&])([A-Za-zd$@$!%*?&]|[^ ])/',
            example: '311eU54$',
          },
        },
      },
      UserUpdateAsAdmin: {
        allOf: [
          { $ref: '#/components/schemas/UserUpdate' },
          {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['USER', 'ADMIN'] },
              isActive: { type: 'boolean' },
            },
          },
        ],
      },
      NaturalPerson: {
        type: 'object',
        required: [
          'name',
          'documentType',
          'documentNumber',
          'expeditionAddress',
          'birthDate',
          'genre',
          'address',
          'phone',
          'email',
          'bank',
          'accountType',
          'bankAccountNumber',
        ],
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 50 },
          documentType: { type: 'string', enum: ['CC', 'CE', 'PAS'] },
          documentNumber: { type: 'string', minLength: 5, maxLength: 20, pattern: '^\\d+$' },
          expeditionAddress: { type: 'string' },
          birthDate: { type: 'string', format: 'date' },
          genre: { type: 'string', enum: ['M', 'F'] },
          address: { type: 'string', minLength: 5, maxLength: 50 },
          phone: { type: 'string', minLength: 10, maxLength: 10, pattern: '^\\d{10}$' },
          phone2: { type: 'string', minLength: 10, maxLength: 10, pattern: '^\\d{10}$' },
          email: { type: 'string', format: 'email' },
          bank: { type: 'string', minLength: 3, maxLength: 20 },
          accountType: { type: 'string', enum: ['AHORROS', 'CORRIENTE'] },
          bankAccountNumber: { type: 'string', minLength: 5, maxLength: 20, pattern: '^\\d+$' },
        },
      },
      JuridicalPerson: {
        type: 'object',
        required: [
          'businessName',
          'businessDocumentNumber',
          'name',
          'documentType',
          'documentNumber',
          'expeditionAddress',
          'birthDate',
          'genre',
          'address',
          'phone',
          'email',
          'bank',
          'accountType',
          'bankAccountNumber',
        ],
        properties: {
          businessName: {
            type: 'string',
            minLength: 3,
            maxLength: 50,
          },
          businessDocumentNumber: {
            type: 'string',
            minLength: 5,
            maxLength: 20,
            pattern: '^\\d+$',
          },
          name: {
            type: 'string',
            minLength: 3,
            maxLength: 50,
          },
          documentType: {
            type: 'string',
            enum: ['CC', 'CE', 'PAS'],
          },
          documentNumber: {
            type: 'string',
            minLength: 5,
            maxLength: 20,
            pattern: '^\\d+$',
          },
          expeditionAddress: {
            type: 'string',
          },
          birthDate: {
            type: 'string',
            format: 'date',
          },
          genre: {
            type: 'string',
            enum: ['M', 'F'],
          },
          address: {
            type: 'string',
            minLength: 5,
            maxLength: 50,
          },
          phone: {
            type: 'string',
            minLength: 10,
            maxLength: 10,
            pattern: '^\\d{10}$',
          },
          phone2: {
            type: 'string',
            minLength: 10,
            maxLength: 10,
            pattern: '^\\d{10}$',
          },
          email: {
            type: 'string',
            format: 'email',
          },
          bank: {
            type: 'string',
            minLength: 3,
            maxLength: 20,
          },
          accountType: {
            type: 'string',
            enum: ['AHORROS', 'CORRIENTE'],
          },
          bankAccountNumber: {
            type: 'string',
            minLength: 5,
            maxLength: 20,
            pattern: '^\\d+$',
          },
        },
      },
      BudgetInformation: {
        type: 'object',
        required: ['certificateNumber', 'issuanceDate', 'totalAssignedAmount', 'rubros'],
        properties: {
          certificateNumber: { type: 'string' },
          issuanceDate: { type: 'string', format: 'date' },
          totalAssignedAmount: { type: 'number', minimum: 0 },
          rubros: {
            type: 'array',
            items: {
              type: 'object',
              required: ['name', 'code', 'assignedAmount'],
              properties: {
                name: { type: 'string' },
                code: { type: 'string' },
                assignedAmount: { type: 'number', minimum: 0 },
              },
            },
            minItems: 1,
          },
        },
      },
    },
  },
  paths: {},
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
