import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('AuthPages.forgotPassword');

  return (
    <AuthLayout
      title={t('title')}
      subtitle={t('subtitle')}
      blobExpression="wink"
      footer={
        <p className="text-sm text-mimoo-ink-500">
          {t('back')}{' '}
          <Link
            href="/login"
            className="text-mimoo-purple-700 hover:text-mimoo-purple-900 font-semibold hover:underline focus:outline-none focus-visible:underline"
          >
            {t('loginLink')}
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
