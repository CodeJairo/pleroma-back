import z, { SafeParseReturnType } from 'zod';

const NaturalPersonSchema = z.object({
  // Información de la persona natural

  name: z
    .string({
      invalid_type_error: 'El nombre debe ser una cadena de texto',
      required_error: 'El nombre es obligatorio',
    })
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(50, { message: 'El nombre debe tener como máximo 50 caracteres' }),

  documentType: z.enum(['CC', 'CE', 'PAS'], {
    invalid_type_error: 'El tipo de documento debe ser una cadena de texto',
    required_error: 'El tipo de documento es obligatorio',
    message: 'El tipo de documento debe ser CC, CE o PAS',
  }),

  documentNumber: z
    .string({
      required_error: 'El número de documento es obligatorio',
    })
    .min(5, {
      message: 'El número de documento debe tener al menos 5 caracteres',
    })
    .max(20, { message: 'El número de documento debe tener como máximo 20 caracteres' })
    .regex(/^\d+$/, {
      message: 'El número de documento debe ser un número',
    }),

  expeditionAddress: z.string({
    invalid_type_error: 'La dirección de expedición debe ser una cadena de texto',
    required_error: 'La dirección de expedición es obligatoria',
  }),

  birthDate: z
    .string({
      required_error: 'La fecha de nacimiento es obligatoria',
      invalid_type_error: 'La fecha de nacimiento debe ser una cadena de texto',
    })
    .date(),

  genre: z.enum(['M', 'F'], {
    invalid_type_error: 'El género debe ser una cadena de texto',
    required_error: 'El género es obligatorio',
  }),

  // Información de contacto

  address: z
    .string({
      invalid_type_error: 'La dirección debe ser una cadena de texto',
      required_error: 'La dirección es obligatoria',
    })
    .min(5, {
      message: 'La dirección debe tener al menos 5 caracteres',
    })
    .max(50, {
      message: 'La dirección debe tener como máximo 50 caracteres',
    }),

  phone: z
    .string({
      required_error: 'El teléfono es obligatorio',
    })
    .length(10, {
      message: 'El teléfono debe tener 10 dígitos',
    })
    .regex(/^\d+$/, {
      message: 'El teléfono debe ser un número',
    }),

  phone2: z
    .string()
    .length(10, {
      message: 'El teléfono alternativo debe tener 10 dígitos',
    })
    .regex(/^\d+$/, {
      message: 'El teléfono alternativo debe ser un número',
    })
    .optional(),

  email: z
    .string({
      invalid_type_error: 'El correo electrónico debe ser una cadena de texto',
      required_error: 'El correo electrónico es obligatorio',
    })
    .email({ message: 'El correo electrónico no es válido' }),

  // Información bancaria

  bank: z
    .string({
      invalid_type_error: 'El banco debe ser una cadena de texto',
      required_error: 'El banco es obligatorio',
    })
    .min(3, { message: 'El banco debe tener al menos 3 caracteres' })
    .max(50, { message: 'El banco debe tener como máximo 50 caracteres' }),

  accountType: z.enum(['AHORROS', 'CORRIENTE'], {
    invalid_type_error: 'El tipo de cuenta debe ser una cadena de texto',
    required_error: 'El tipo de cuenta es obligatorio',
  }),

  anotherBank: z
    .string({
      invalid_type_error: 'El banco alternativo debe ser una cadena de texto',
    })
    .min(3, { message: 'El banco alternativo debe tener al menos 3 caracteres' })
    .max(50, { message: 'El banco alternativo debe tener como máximo 50 caracteres' })
    .optional(),

  bankAccountNumber: z
    .string({
      invalid_type_error: 'El número de cuenta debe ser una cadena de texto',
      required_error: 'El número de cuenta es obligatorio',
    })
    .min(5, { message: 'El número de cuenta debe tener al menos 5 caracteres' })
    .max(20, { message: 'El número de cuenta debe tener como máximo 20 caracteres' })
    .regex(/^\d+$/, {
      message: 'El número de cuenta debe ser un número',
    }),
});

export function validateNaturalPerson(data: unknown): SafeParseReturnType<unknown, z.infer<typeof NaturalPersonSchema>> {
  return NaturalPersonSchema.strict().safeParse(data);
}

export function validateNaturalPersonUpdate(data: unknown) {
  return NaturalPersonSchema.partial().strict().safeParse(data);
}
