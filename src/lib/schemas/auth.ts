import { z } from 'zod';

/** Keep in sync with Clerk → User & authentication → Password (min length). */
export const PASSWORD_MIN_LENGTH = 8;

// trim first, then validate: " me@x.com " is accepted and "required" shows before "invalid".
const email = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .pipe(z.email('Enter a valid email.'));

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  email,
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`),
});

export type SignUpFormSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email,
  // Only require a value on sign-in: the server decides if it is correct, and
  // existing accounts may predate the current minimum length.
  password: z.string().min(1, 'Password is required.'),
});

export type SignInFormSchema = z.infer<typeof signInSchema>;

export const codeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code.'),
});

export type CodeFormSchema = z.infer<typeof codeSchema>;
