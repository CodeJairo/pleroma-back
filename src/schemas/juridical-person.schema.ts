import z, { SafeParseReturnType } from 'zod';

const JuridicalPersonSchema = z.object({
  // Juridical Person information

  businessName: z
    .string({
      invalid_type_error: 'Business name must be a string',
      required_error: 'Business name is required',
    })
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(50, { message: 'Must be 50 or fewer characters long' }),

  businessDocumentNumber: z
    .string({
      required_error: 'Business Document number is required',
    })
    .min(5, {
      message: 'Business Document number must be at least 5 characters long',
    })
    .max(20, { message: 'Business Document number must be less than 20 characters long' })
    .regex(/^\d+$/, {
      message: 'Business Document number must be a number',
    }),

  // Legal representative information

  name: z
    .string({
      invalid_type_error: 'Name must be a string',
      required_error: 'Name is required',
    })
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(50, { message: 'Must be 50 or fewer characters long' }),

  documentType: z.enum(['CC', 'CE', 'PAS'], {
    invalid_type_error: 'Document type must be a string',
    required_error: 'Document type is required',
    message: 'Document type must be one of CC, CE, PAS',
  }),

  documentNumber: z
    .string({
      required_error: 'Document number is required',
    })
    .min(5, {
      message: 'Document number must be at least 5 characters long',
    })
    .max(20, { message: 'Document number must be less than 20 characters long' })
    .regex(/^\d+$/, {
      message: 'Document number must be a number',
    }),

  expeditionAddress: z.string({
    invalid_type_error: 'Expedition address must be a string',
    required_error: 'Expedition address is required',
  }),

  birthDate: z
    .string({ required_error: 'Birth Date is required', invalid_type_error: 'Birth Date must be a string' })
    .date(),

  genre: z.enum(['M', 'F'], {
    invalid_type_error: 'Genre must be a string',
    required_error: 'Genre is required',
  }),

  // Contact information

  address: z
    .string({
      invalid_type_error: 'Address must be a string',
      required_error: 'Address is required',
    })
    .min(5, {
      message: 'Address must be at least 5 characters long',
    })
    .max(50, {
      message: 'Address must be less than 50 characters long',
    }),

  phone: z
    .string({
      required_error: 'Phone is required',
    })
    .length(10, {
      message: 'Phone must be 10 characters long',
    })
    .regex(/^\d+$/, {
      message: 'Phone must be a number',
    }),

  phone2: z
    .string()
    .length(10, {
      message: 'Phone must be 10 characters long',
    })
    .regex(/^\d+$/, {
      message: 'Phone must be a number',
    })
    .optional(),

  email: z
    .string({
      invalid_type_error: 'Email must be a string',
      required_error: 'Email is required',
    })
    .email({ message: 'Invalid email address' }),

  // Bank information

  bank: z
    .string({
      invalid_type_error: 'Bank must be a string',
      required_error: 'Bank is required',
    })
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(20, { message: 'Must be 20 or fewer characters long' }),

  accountType: z.enum(['AHORROS', 'CORRIENTE'], {
    invalid_type_error: 'Account type must be a string',
    required_error: 'Account type is required',
  }),

  bankAccountNumber: z
    .string({
      invalid_type_error: 'Account number must be a string',
      required_error: 'Account number is required',
    })
    .min(5, { message: 'Must be 5 or more characters long' })
    .max(20, { message: 'Must be 20 or fewer characters long' })
    .regex(/^\d+$/, {
      message: 'Account number must be a number',
    }),
});

export function validateJuridicalPerson(
  data: unknown
): SafeParseReturnType<unknown, z.infer<typeof JuridicalPersonSchema>> {
  return JuridicalPersonSchema.safeParse(data);
}

export function validateJuridicalPersonUpdate(data: unknown) {
  return JuridicalPersonSchema.partial().safeParse(data);
}
