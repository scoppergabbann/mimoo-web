import { setRequestLocale, getTranslations } from 'next-intl/server';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('AuthPages.resetPassword');

  return (
    <AuthLayout
      title={t('title')}
      subtitle={t('subtitle')}
      blobExpression="sparkle"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
