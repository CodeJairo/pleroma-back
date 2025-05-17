import z from 'zod';

const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ])/;

const userSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .min(5, { message: 'Must be 5 or more characters long' })
    .max(15, { message: 'Must be 15 or fewer characters long' }),

  email: z
    .string({
      invalid_type_error: 'Email must be a string',
      required_error: 'Email is required',
    })
    .email({ message: 'Invalid email format' }),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password must be at most 20 characters long' })
    .regex(regex, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number',
    }),

  role: z.enum(['ADMIN', 'USER'], { invalid_type_error: 'Role must be either ADMIN or USER' }),

  isActive: z.boolean({ invalid_type_error: 'isActive must be a boolean' }),
});

export function validateUser(data: unknown) {
  return userSchema.pick({ username: true, email: true, password: true }).strict().safeParse(data);
}

export function validateLogin(data: unknown) {
  return userSchema.pick({ email: true, password: true }).strict().safeParse(data);
}

export function validateUpdateUser(data: unknown) {
  const schema = userSchema
    .pick({ email: true, username: true, password: true })
    .partial()
    .strict()
    .refine(obj => !!obj.email || !!obj.username || !!obj.password, {
      message: 'At least one field must be provided',
    });
  return schema.safeParse(data);
}

export function validateUpdateUserAsAdmin(data: unknown) {
  return userSchema.partial().strict().safeParse(data);
}
