import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('AuthPages.register');

  return (
    <AuthLayout
      title={t('title')}
      subtitle={t('subtitle')}
      blobExpression="love"
      footer={
        <p className="text-sm text-mimoo-ink-500">
          {t('haveAccount')}{' '}
          <Link
            href="/login"
            className="text-mimoo-purple-700 hover:text-mimoo-purple-900 font-semibold hover:underline focus:outline-none focus-visible:underline"
          >
            {t('login')}
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
