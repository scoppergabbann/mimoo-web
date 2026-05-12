'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { logContactRevealAction } from '@/lib/items/actions';
import type { EmergencyContactDecrypted } from '@/lib/items/types';

interface EmergencyContactRevealProps {
  recoveryCode: string;
  contact: EmergencyContactDecrypted;
  labels: {
    title: string;
    description: string;
    rewardBadge: string;
    rewardLabel: string;
  };
}

/**
 * Normalize Indonesian phone number to international format for wa.me.
 * Examples:
 *   08123456789 → 628123456789
 *   +628123456789 → 628123456789
 *   628123456789 → 628123456789
 */
function normalizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) return '62' + digits.substring(1);
  if (digits.startsWith('62')) return digits;
  return '62' + digits;
}

export function EmergencyContactReveal({
  recoveryCode,
  contact,
  labels,
}: EmergencyContactRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [, startTransition] = useTransition();

  function handleReveal(channel: 'whatsapp' | 'phone' | 'email') {
    setRevealed(true);
    // Log the reveal (anti-abuse audit) — fire-and-forget
    startTransition(async () => {
      await logContactRevealAction(recoveryCode, channel);
    });
  }

  const hasContact = contact.whatsapp || contact.phone || contact.email;

  if (!hasContact && !contact.has_reward) {
    return null;
  }

  return (
    <div className="bg-white rounded-cozy-lg p-5 mb-4 border-2 border-mimoo-purple-100 text-left">
      {/* Reward badge — show prominently if exists */}
      {contact.has_reward && (
        <div className="mb-4 -mx-5 -mt-5 px-5 py-3 bg-gradient-to-r from-mimoo-mint-100 to-mimoo-mint-200 rounded-t-cozy-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              🎁
            </span>
            <Badge variant="green" size="sm">
              {labels.rewardBadge}
            </Badge>
          </div>
          {contact.reward_description && (
            <p className="text-sm text-mimoo-ink-900 mt-2 leading-relaxed">
              {contact.reward_description}
            </p>
          )}
        </div>
      )}

      {hasContact && (
        <>
          <h3 className="font-display font-bold text-mimoo-ink-900 text-base mb-1">
            {labels.title}
          </h3>
          <p className="text-xs text-mimoo-ink-500 mb-4 leading-relaxed">
            {labels.description}
          </p>

          <div className="space-y-2">
            {contact.whatsapp && (
              <WhatsAppButton
                whatsappNumber={contact.whatsapp}
                revealed={revealed}
                onReveal={() => handleReveal('whatsapp')}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface WhatsAppButtonProps {
  whatsappNumber: string;
  revealed: boolean;
  onReveal: () => void;
}

function WhatsAppButton({ whatsappNumber, revealed, onReveal }: WhatsAppButtonProps) {
  // Bridge: never show the raw number in the UI; user clicks → open wa.me
  // (URL contains the number but only briefly during click)
  if (!revealed) {
    return (
      <Button
        variant="primary"
        size="md"
        onClick={onReveal}
        className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white"
        leftIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 0 1-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
          </svg>
        }
      >
        Chat via WhatsApp
      </Button>
    );
  }

  // Revealed state: render anchor that opens wa.me link
  const normalized = normalizeWhatsAppNumber(whatsappNumber);
  const message = encodeURIComponent(
    'Halo! Saya menemukan barang yang sepertinya milik kamu lewat Mimoo 💜'
  );
  const waUrl = `https://wa.me/${normalized}?text=${message}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <Button
        variant="primary"
        size="md"
        className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white"
        leftIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 0 1-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
          </svg>
        }
      >
        Buka WhatsApp Sekarang →
      </Button>
    </a>
  );
}
