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
          name: { type: 'string', minLength: 3, maxLength: 50, description: 'Nombre completo', example: 'Juan Pérez' },
          documentType: { type: 'string', enum: ['CC', 'CE', 'PAS'], description: 'Tipo de documento', example: 'CC' },
          documentNumber: {
            type: 'string',
            minLength: 5,
            maxLength: 20,
            pattern: '^\\d+$',
            description: 'Número de documento',
            example: '1234567890',
          },
          expeditionAddress: { type: 'string', description: 'Lugar de expedición del documento', example: 'Bogotá' },
          birthDate: { type: 'string', format: 'date', description: 'Fecha de nacimiento', example: '1990-01-01' },
          genre: { type: 'string', enum: ['M', 'F'], description: 'Género', example: 'M' },
          address: { type: 'string', minLength: 5, maxLength: 50, description: 'Dirección de residencia', example: 'Calle 45 #67-89' },
          phone: {
            type: 'string',
            minLength: 10,
            maxLength: 10,
            pattern: '^\\d{10}$',
            description: 'Teléfono principal',
            example: '3009876543',
          },
          phone2: {
            type: 'string',
            minLength: 10,
            maxLength: 10,
            pattern: '^\\d{10}$',
            description: 'Teléfono alternativo',
            example: '3101234567',
          },
          email: { type: 'string', format: 'email', description: 'Correo electrónico', example: 'juan@email.com' },
          bank: { type: 'string', minLength: 3, maxLength: 50, description: 'Banco', example: 'Davivienda' },
          accountType: { type: 'string', enum: ['AHORROS', 'CORRIENTE'], description: 'Tipo de cuenta bancaria', example: 'AHORROS' },
          bankAccountNumber: {
            type: 'string',
            minLength: 5,
            maxLength: 20,
            pattern: '^\\d+$',
            description: 'Número de cuenta bancaria',
            example: '9876543210',
          },
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
          businessName: { type: 'string', minLength: 3, maxLength: 50, description: 'Nombre de la empresa', example: 'Empresa S.A.' },
          businessDocumentNumber: {
            type: 'string',
            minLength: 5,
            maxLength: 20,
            pattern: '^\\d+$',
            description: 'NIT de la empresa',
            example: '900123456',
          },
          name: {
            type: 'string',
            minLength: 3,
            maxLength: 50,
            description: 'Nombre del representante legal',
            example: 'Representante Legal',
          },
          documentType: {
            type: 'string',
            enum: ['CC', 'CE', 'PAS'],
            description: 'Tipo de documento del representante',
            example: 'CC',
          },
          documentNumber: {
            type: 'string',
            minLength: 5,
            maxLength: 20,
            pattern: '^\\d+$',
            description: 'Número de documento del representante',
            example: '1234567890',
          },
          expeditionAddress: { type: 'string', description: 'Lugar de expedición del documento', example: 'Bogotá' },
          birthDate: { type: 'string', format: 'date', description: 'Fecha de nacimiento del representante', example: '1980-01-01' },
          genre: { type: 'string', enum: ['M', 'F'], description: 'Género del representante', example: 'M' },
          address: {
            type: 'string',
            minLength: 5,
            maxLength: 50,
            description: 'Dirección de la empresa',
            example: 'Calle 123 #45-67',
          },
          phone: {
            type: 'string',
            minLength: 10,
            maxLength: 10,
            pattern: '^\\d{10}$',
            description: 'Teléfono principal',
            example: '3001234567',
          },
          phone2: {
            type: 'string',
            minLength: 10,
            maxLength: 10,
            pattern: '^\\d{10}$',
            description: 'Teléfono alternativo',
            example: '3101234567',
          },
          email: { type: 'string', format: 'email', description: 'Correo electrónico', example: 'empresa@email.com' },
          bank: { type: 'string', minLength: 3, maxLength: 50, description: 'Banco', example: 'Bancolombia' },
          accountType: { type: 'string', enum: ['AHORROS', 'CORRIENTE'], description: 'Tipo de cuenta bancaria', example: 'AHORROS' },
          bankAccountNumber: {
            type: 'string',
            minLength: 5,
            maxLength: 20,
            pattern: '^\\d+$',
            description: 'Número de cuenta bancaria',
            example: '1234567890',
          },
        },
      },
      Contractor: {
        type: 'object',
        required: ['id', 'contractor', 'contractorDocument', 'expeditionAddress', 'birthDate', 'genre'],
        properties: {
          id: { type: 'string', description: 'ID único del contratista', example: 'clwxyz1234567890' },
          contractor: { type: 'string', description: 'Nombre del contratista', example: 'Juan Pérez o Empresa S.A.' },
          contractorDocument: { type: 'string', description: 'Documento del contratista', example: '1234567890' },
          expeditionAddress: { type: 'string', description: 'Lugar de expedición del documento', example: 'Bogotá' },
          birthDate: { type: 'string', format: 'date', description: 'Fecha de nacimiento o constitución', example: '1990-01-01' },
          genre: { type: 'string', enum: ['M', 'F'], description: 'Género (si aplica)', example: 'M' },
        },
        description: 'Contratista, puede ser persona natural o jurídica con campos comunes.',
      },
      BudgetInformation: {
        type: 'object',
        required: ['certificateNumber', 'issuanceDate', 'totalAssignedAmount', 'rubros'],
        properties: {
          certificateNumber: {
            type: 'string',
            description: 'Número de certificado',
            example: 'CERT-2025-001',
          },
          issuanceDate: {
            type: 'string',
            format: 'date',
            description: 'Fecha de expedición',
            example: '2025-05-21',
          },
          totalAssignedAmount: {
            type: 'number',
            minimum: 0.01,
            description: 'Monto total asignado',
            example: 1000000,
          },
          rubros: {
            type: 'array',
            minItems: 1,
            description: 'Lista de rubros presupuestales',
            items: {
              type: 'object',
              required: ['name', 'code', 'assignedAmount'],
              properties: {
                name: {
                  type: 'string',
                  description: 'Nombre del rubro',
                  example: 'Rubro 1',
                },
                code: {
                  type: 'string',
                  description: 'Código del rubro',
                  example: 'R1',
                },
                assignedAmount: {
                  type: 'number',
                  minimum: 0.01,
                  description: 'Monto asignado al rubro',
                  example: 500000,
                },
              },
            },
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
