'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface QRCodeDisplayProps {
  /** The full URL to encode in the QR code */
  url: string;
  /** Display size in pixels */
  size?: number;
  /** Filename for downloaded PNG */
  filename?: string;
  /** Show URL underneath */
  showUrl?: boolean;
  className?: string;
}

export function QRCodeDisplay({
  url,
  size = 256,
  filename = 'mimoo-qr.png',
  showUrl = true,
  className,
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      url,
      {
        width: size,
        margin: 2,
        color: {
          dark: '#1A1A2E', // mimoo-ink-900
          light: '#FFFDF8', // mimoo-cream-50
        },
        errorCorrectionLevel: 'H', // high (30% recovery)
      },
      (err) => {
        if (err) {
          console.error('QR generation error:', err);
          return;
        }
        // Generate downloadable PNG data URL
        if (canvasRef.current) {
          const dataUrl = canvasRef.current.toDataURL('image/png');
          setDownloadUrl(dataUrl);
        }
      }
    );
  }, [url, size]);

  function handleDownload() {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* QR Container with branded frame */}
      <div className="relative">
        <div className="bg-gradient-to-br from-mimoo-purple-100 to-mimoo-purple-200 rounded-cozy-xl p-4 shadow-soft-lg">
          <div className="bg-white rounded-cozy-lg p-4">
            <canvas
              ref={canvasRef}
              aria-label="QR code untuk recovery page"
              className="block"
            />
          </div>
        </div>
        {/* Decorative sparkles */}
        <div
          className="absolute -top-2 -right-2 w-4 h-4 bg-mimoo-pink-300 rounded-full animate-sparkle"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-2 -left-2 w-3 h-3 bg-mimoo-sky-300 rounded-full animate-sparkle"
          style={{ animationDelay: '1.5s' }}
          aria-hidden="true"
        />
      </div>

      {/* URL Display */}
      {showUrl && (
        <button
          type="button"
          onClick={handleCopyLink}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-mimoo-purple-50 hover:bg-mimoo-purple-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400"
          aria-label="Salin URL"
        >
          <code className="text-sm text-mimoo-purple-700 font-mono break-all">
            {url}
          </code>
          <span
            className="text-xs text-mimoo-purple-500 font-medium"
            aria-live="polite"
          >
            {copied ? '✓ Disalin!' : '📋'}
          </span>
        </button>
      )}

      {/* Download button */}
      <Button
        variant="primary"
        size="md"
        onClick={handleDownload}
        disabled={!downloadUrl}
        leftIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        }
      >
        Download QR (PNG)
      </Button>
    </div>
  );
}
