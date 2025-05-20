import z from 'zod';

const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ])/;

const userSchema = z.object({
  username: z
    .string({
      required_error: 'El nombre de usuario es obligatorio',
      invalid_type_error: 'El nombre de usuario debe ser una cadena de texto',
    })
    .min(5, { message: 'Debe tener al menos 5 caracteres' })
    .max(15, { message: 'Debe tener como máximo 15 caracteres' }),

  email: z
    .string({
      invalid_type_error: 'El correo electrónico debe ser una cadena de texto',
      required_error: 'El correo electrónico es obligatorio',
    })
    .email({ message: 'El formato del correo electrónico no es válido' }),

  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .max(20, { message: 'La contraseña debe tener como máximo 20 caracteres' })
    .regex(regex, {
      message: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
    }),

  role: z.enum(['ADMIN', 'USER'], { invalid_type_error: 'El rol debe ser ADMIN o USER' }),

  isActive: z.boolean({ invalid_type_error: 'isActive debe ser un valor booleano' }),
});

export function validateUser(data: unknown) {
  return userSchema.pick({ username: true, email: true, password: true }).strict().safeParse(data);
}

export function validateLogin(data: unknown) {
  return userSchema.pick({ email: true, password: true }).strict().safeParse(data);
}

const updateUserSchema = z
  .object({
    email: userSchema.shape.email.optional(),
    username: userSchema.shape.username.optional(),
    password: userSchema.shape.password.optional(),
  })
  .strict()
  .refine(obj => !!obj.email || !!obj.username || !!obj.password, {
    message: 'Debe enviar al menos uno de: email, username o password.',
  });

export function validateUpdateUser(data: unknown) {
  return updateUserSchema.safeParse(data);
}

export function validateUpdateUserAsAdmin(data: unknown) {
  return userSchema.partial().strict().safeParse(data);
}
