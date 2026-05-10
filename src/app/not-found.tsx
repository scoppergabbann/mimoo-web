import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { MimooBlob } from '@/lib/avatar/MimooBlob';

export default function NotFound() {
  return (
    <html lang="id">
      <body className="bg-mimoo-cream-100 font-body antialiased">
        <main className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <MimooBlob size="xl" expression="wink" />
            </div>
            <h1 className="font-display text-6xl font-extrabold text-mimoo-purple-500 mb-2">
              404
            </h1>
            <h2 className="font-display text-2xl font-bold text-mimoo-ink-900 mb-4">
              Halaman ini juga ikut hilang 🥲
            </h2>
            <p className="text-mimoo-ink-500 mb-8 leading-relaxed">
              Tapi tenang, kita bisa bantu kamu kembali ke jalan yang benar.
            </p>
            <Link href="/">
              <Button variant="primary" size="lg">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
