import { notFound } from 'next/navigation';
import { getPublicItemByCode } from '@/lib/items/queries';
import { isValidRecoveryCode } from '@/lib/items/recovery-code';
import { MimooLogo } from '@/components/layout/MimooLogo';
import { Card } from '@/components/ui/Card';
import { FinderForm } from '@/components/recovery/FinderForm';

export const dynamic = 'force-dynamic';

interface FoundReportPageProps {
  params: Promise<{ code: string }>;
}

export default async function FoundReportPage({ params }: FoundReportPageProps) {
  const { code } = await params;
  const normalized = code.toUpperCase();

  if (!isValidRecoveryCode(normalized)) {
    notFound();
  }

  const item = await getPublicItemByCode(normalized);
  if (!item) notFound();

  const labels = {
    title: 'Yay, kamu hero hari ini! 💜',
    subtitle: 'Tinggal kirim pesan singkat. Pemilik akan langsung dapat notif.',
    messageLabel: 'Pesan untuk Pemilik',
    messagePlaceholder: 'Halo! Saya menemukan barang ini di...',
    messageHelper: 'Ceritain di mana & gimana ketemunya',
    locationLabel: 'Lokasi Ditemukan',
    locationPlaceholder: 'Mis. Kantin lantai 2 Mall X, Jakarta',
    locationHelper: 'Bantu pemilik bayangin di mana persis',
    useGpsLabel: 'Pakai GPS untuk lokasi akurat',
    gpsLoading: 'Mengambil lokasi...',
    gpsCaptured: 'Lokasi GPS sudah ke-ambil ✓',
    gpsError: 'Gagal ambil GPS, ketik manual aja ya',
    nameLabel: 'Nama Kamu',
    namePlaceholder: 'Mis. Ahmad',
    nameOptional: 'opsional',
    contactLabel: 'Cara Pemilik Bisa Hubungi Kamu',
    contactPlaceholder: 'Mis. WA 0812xxx atau email kamu@example.com',
    contactOptional: 'opsional',
    submit: 'Kirim Pesan',
    cancel: 'Batal',
    successTitle: 'Pesan terkirim! 💜',
    successDesc:
      'Kami sudah notif pemilik. Kamu baik banget sudah luangin waktu untuk bantu. Semoga kebaikan ini balik ke kamu! 🫶',
    backHome: 'Kembali ke Beranda',
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-cozy">
      {/* Top bar */}
      <header className="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto w-full">
        <a href="/" className="inline-block">
          <MimooLogo size="md" />
        </a>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 pb-12">
        <div className="max-w-xl mx-auto">
          <Card variant="elevated" className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <p className="text-xs text-mimoo-ink-300 uppercase tracking-wider font-semibold mb-1">
                Recovery {item.recovery_code}
              </p>
              <h1 className="font-display text-xl font-bold text-mimoo-ink-900 mb-1">
                {item.name}
              </h1>
              <p className="text-sm text-mimoo-purple-700">
                Milik {item.owner_name}
              </p>
            </div>

            <FinderForm
              recoveryCode={normalized}
              itemName={item.name}
              labels={labels}
            />
          </Card>
        </div>
      </main>
    </div>
  );
}
