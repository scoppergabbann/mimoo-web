import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { AvatarShowcase } from '@/components/sections/AvatarShowcase';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { ProductShowcase } from '@/components/sections/ProductShowcase';
import { AppPreview } from '@/components/sections/AppPreview';
import { CTA } from '@/components/sections/CTA';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <HowItWorksSection />
      <AvatarShowcase />
      <FeaturesSection />
      <ProductShowcase />
      <AppPreview />
      <CTA />
    </>
  );
}
