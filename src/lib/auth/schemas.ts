import { z } from 'zod';

/**
 * Schema untuk Login form.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email tidak boleh kosong')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password tidak boleh kosong')
    .min(8, 'Password minimal 8 karakter'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Schema untuk Register form.
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nama tidak boleh kosong')
      .min(2, 'Nama minimal 2 karakter')
      .max(50, 'Nama maksimal 50 karakter'),
    email: z
      .string()
      .min(1, 'Email tidak boleh kosong')
      .email('Format email tidak valid'),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(/[A-Z]/, 'Password harus ada huruf besar')
      .regex(/[a-z]/, 'Password harus ada huruf kecil')
      .regex(/[0-9]/, 'Password harus ada angka'),
    confirmPassword: z.string(),
    character: z.enum(['denpa', 'jaya', 'salma', 'kupa']).default('denpa'),
    skinTone: z.enum(['light', 'medium', 'tan', 'deep']).default('medium'),
    outfit: z.enum(['purple', 'blue', 'pink', 'cream', 'sage']).default('purple'),
    accent: z.enum(['purple', 'blue', 'pink']).default('purple'),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'Kamu harus menyetujui Syarat & Ketentuan',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Schema untuk Forgot Password.
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email tidak boleh kosong')
    .email('Format email tidak valid'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Schema untuk Reset Password.
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(/[A-Z]/, 'Password harus ada huruf besar')
      .regex(/[a-z]/, 'Password harus ada huruf kecil')
      .regex(/[0-9]/, 'Password harus ada angka'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
