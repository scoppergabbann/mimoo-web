import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';

export default async function AuthErrorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('AuthPages.authError');

  return (
    <AuthLayout title={t('title')} subtitle={t('subtitle')} blobExpression="wink">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-2" aria-hidden="true">
          😅
        </div>
        <Link href="/login" className="block">
          <Button variant="primary" size="lg" className="w-full">
            {t('tryAgain')}
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
