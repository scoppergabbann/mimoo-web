import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicItemByCode, getEmergencyContact } from '@/lib/items/queries';
import { RecoveryPage } from '@/components/recovery/RecoveryPage';
import { isValidRecoveryCode } from '@/lib/items/recovery-code';

export const dynamic = 'force-dynamic';

interface FoundPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: FoundPageProps): Promise<Metadata> {
  const { code } = await params;
  const normalized = code.toUpperCase();

  if (!isValidRecoveryCode(normalized)) {
    return { title: 'Not Found · Mimoo' };
  }

  const item = await getPublicItemByCode(normalized);
  if (!item) return { title: 'Not Found · Mimoo' };

  return {
    title: `${item.name} · Mimoo`,
    description: `Bantu ${item.owner_name || 'pemilik'} dapatkan barangnya kembali via Mimoo`,
    robots: { index: false, follow: false }, // Don't index recovery URLs
  };
}

export default async function FoundPage({ params }: FoundPageProps) {
  const { code } = await params;
  const normalized = code.toUpperCase();

  if (!isValidRecoveryCode(normalized)) {
    notFound();
  }

  const item = await getPublicItemByCode(normalized);
  if (!item) notFound();

  // Fetch emergency contact only if item is in lost mode
  const emergencyContact = item.is_lost
    ? await getEmergencyContact(normalized)
    : null;

  // Default labels in Indonesian (public page)
  const labels = {
    badge: 'Found via Mimoo',
    thankYou: 'Terima kasih sudah membantu barang ini menemukan jalannya pulang 🫶',
    belongsTo: 'Barang ini milik',
    foundButton: 'Saya Menemukan Barang Ini',
    lostBadge: '⚠️ DICARI',
    lostUrgentTitle: 'Barang ini sedang hilang!',
    lostUrgentDesc:
      'Pemilik sedang mencari barang ini. Yuk bantu kembalikan dengan menghubungi mereka langsung di bawah ini.',
    rewardBadge: 'Ada Reward!',
    rewardLabel: 'Reward dari pemilik',
    contactTitle: 'Hubungi Pemilik',
    contactDesc: 'Klik tombol di bawah untuk chat langsung via WhatsApp.',
    poweredBy: 'Powered by',
    learnMoreAboutMimoo: 'Pelajari Mimoo →',
  };

  return <RecoveryPage item={item} emergencyContact={emergencyContact} labels={labels} />;
}
