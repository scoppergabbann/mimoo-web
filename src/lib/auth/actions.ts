'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from './schemas';

export type ActionResult = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

/**
 * LOGIN action
 */
export async function loginAction(input: LoginInput): Promise<ActionResult> {
  // Validate input
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    });
    return { fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    // Map Supabase errors to friendly Indonesian messages
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Email atau password salah. Yuk coba lagi 🥺' };
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Email kamu belum dikonfirmasi. Cek inbox ya!' };
    }
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * REGISTER action
 */
export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    });
    return { fieldErrors };
  }

  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
        avatar_character: parsed.data.character,
        avatar_skin_tone: parsed.data.skinTone,
        avatar_outfit: parsed.data.outfit,
        avatar_accent: parsed.data.accent,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Email ini sudah terdaftar. Coba login aja 😊' };
    }
    return { error: error.message };
  }

  // If email confirmation required, signUp returns user but no session
  if (data.user && !data.session) {
    return {
      success: true,
      error: 'CONFIRMATION_NEEDED', // Special signal handled by UI
    };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * GOOGLE OAUTH action
 */
export async function signInWithGoogleAction(
  locale: 'id' | 'en' = 'id'
): Promise<ActionResult> {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?locale=${locale}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return { error: 'Gagal connect ke Google. Coba lagi ya!' };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { success: true };
}

/**
 * FORGOT PASSWORD action — kirim magic link via email
 */
export async function forgotPasswordAction(
  input: ForgotPasswordInput
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    });
    return { fieldErrors };
  }

  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: 'Gagal kirim email reset. Coba lagi ya!' };
  }

  return { success: true };
}

/**
 * RESET PASSWORD action
 */
export async function resetPasswordAction(
  input: ResetPasswordInput
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    });
    return { fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * LOGOUT action
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

/**
 * COMPLETE ONBOARDING — mark user as having seen welcome flow
 */
export async function completeOnboardingAction(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('profiles')
    .update({ onboarded_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) {
    console.error('Onboarding completion error:', error);
    return { error: 'Failed to complete onboarding' };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}
