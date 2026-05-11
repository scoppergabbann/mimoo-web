import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

// Loading fallback for Suspense
function LoginFormFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-mimoo-purple-50 rounded-cozy" />
      <div className="h-12 bg-mimoo-purple-50 rounded-cozy" />
      <div className="h-12 bg-mimoo-purple-50 rounded-cozy" />
      <div className="h-12 bg-mimoo-purple-100 rounded-pill" />
    </div>
  );
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('AuthPages.login');

  return (
    <AuthLayout
      title={t('title')}
      subtitle={t('subtitle')}
      blobExpression="happy"
      footer={
        <p className="text-sm text-mimoo-ink-500">
          {t('noAccount')}{' '}
          <Link
            href="/register"
            className="text-mimoo-purple-700 hover:text-mimoo-purple-900 font-semibold hover:underline focus:outline-none focus-visible:underline"
          >
            {t('register')}
          </Link>
        </p>
      }
    >
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
