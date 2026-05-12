import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { SimplePageHeader } from '@/components/sections/SimplePageHeader';
import { ContactForm } from '@/components/contact/ContactForm';

interface ContactChannel {
  title: string;
  description: string;
  value: string;
  responseTime: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('ContactPage');
  const tForm = await getTranslations('ContactPage.form');
  const channelsData = t.raw('channels') as Record<string, ContactChannel>;
  const channels = Object.entries(channelsData);

  return (
    <>
      <SimplePageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={t('badge')}
        blobExpression="love"
      />

      {/* Contact channels grid */}
      <section className="py-12 lg:py-16 bg-mimoo-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6 mb-12">
            {channels.map(([key, ch]) => (
              <Card key={key} variant="default" className="h-full">
                <h3 className="font-display text-lg font-bold text-mimoo-ink-900 mb-1">
                  {ch.title}
                </h3>
                <p className="text-sm text-mimoo-ink-500 mb-3">{ch.description}</p>
                <a
                  href={`mailto:${ch.value}`}
                  className="inline-flex items-center gap-1 text-mimoo-purple-700 hover:text-mimoo-purple-900 font-semibold hover:underline"
                >
                  {ch.value}
                </a>
                <p className="text-xs text-mimoo-ink-300 mt-2">{ch.responseTime}</p>
              </Card>
            ))}
          </div>

          {/* Form */}
          <Card variant="elevated" className="p-6 lg:p-8">
            <div className="text-center mb-6">
              <h2 className="font-display text-xl lg:text-2xl font-bold text-mimoo-ink-900 mb-2">
                {tForm('title')}
              </h2>
              <p className="text-sm text-mimoo-ink-500 max-w-md mx-auto">
                {tForm('description')}
              </p>
            </div>
            <ContactForm
              labels={{
                title: tForm('title'),
                description: tForm('description'),
                name: tForm('name'),
                namePlaceholder: tForm('namePlaceholder'),
                email: tForm('email'),
                emailPlaceholder: tForm('emailPlaceholder'),
                subject: tForm('subject'),
                subjectPlaceholder: tForm('subjectPlaceholder'),
                category: tForm('category'),
                categoryOptions: {
                  general: tForm('categoryOptions.general'),
                  support: tForm('categoryOptions.support'),
                  partnership: tForm('categoryOptions.partnership'),
                  feedback: tForm('categoryOptions.feedback'),
                  press: tForm('categoryOptions.press'),
                  other: tForm('categoryOptions.other'),
                },
                message: tForm('message'),
                messagePlaceholder: tForm('messagePlaceholder'),
                submit: tForm('submit'),
                cancel: tForm('cancel'),
                successTitle: tForm('successTitle'),
                successDesc: tForm('successDesc'),
                errorMessage: tForm('errorMessage'),
              }}
            />
          </Card>
        </div>
      </section>

      {/* Office info */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-display text-xl font-bold text-mimoo-ink-900 mb-2">
            {t('office.title')}
          </h3>
          <p className="text-mimoo-ink-700 mb-1">{t('office.address')}</p>
          <p className="text-sm text-mimoo-ink-500 italic">{t('office.note')}</p>
        </div>
      </section>
    </>
  );
}
