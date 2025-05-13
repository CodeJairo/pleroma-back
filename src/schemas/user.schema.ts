import z, { SafeParseReturnType } from 'zod';

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
});

export function validateUser(data: unknown): SafeParseReturnType<unknown, z.infer<typeof userSchema>> {
  return userSchema.safeParse(data);
}

export function validateLogin(data: unknown) {
  return userSchema.pick({ email: true, password: true }).safeParse(data);
}

export function validateUpdate(data: unknown) {
  return userSchema.partial().safeParse(data);
}
