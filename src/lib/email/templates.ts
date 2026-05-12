interface FinderReportEmailData {
  ownerName: string;
  itemName: string;
  finderMessage: string;
  finderLocation: string;
  finderName: string | null;
  finderContact: string | null;
  hasGpsLocation: boolean;
  gpsLat?: number | null;
  gpsLng?: number | null;
  itemDetailUrl: string;
  locale: 'id' | 'en';
}

/**
 * Renders the HTML email body untuk finder report notification.
 * Inline styles (email clients gak support external CSS / Tailwind).
 *
 * Cozy Mimoo aesthetic — purple/cream palette, rounded corners,
 * friendly Indonesian tone.
 */
export function renderFinderReportEmail(data: FinderReportEmailData) {
  const t = data.locale === 'en' ? translations.en : translations.id;
  const mapUrl =
    data.hasGpsLocation && data.gpsLat && data.gpsLng
      ? `https://www.google.com/maps?q=${data.gpsLat},${data.gpsLng}`
      : null;

  const subject = t.subject(data.itemName);

  // Pure inline styles - tested in Gmail, Outlook, Apple Mail
  const html = `<!DOCTYPE html>
<html lang="${data.locale}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#FFF9F0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2D2D45;-webkit-font-smoothing:antialiased;">
  <div style="background-color:#FFF9F0;padding:24px 16px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;margin:0 auto;">

      <!-- Header logo -->
      <tr>
        <td align="center" style="padding:12px 0 24px 0;">
          <div style="font-family:Georgia,serif;font-size:28px;font-weight:800;color:#8B7FD9;letter-spacing:-1px;">
            Mimoo <span style="font-size:18px;">✦</span>
          </div>
        </td>
      </tr>

      <!-- Main card -->
      <tr>
        <td>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:linear-gradient(135deg,#F5F2FF 0%,#FFF9F0 100%);border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:32px 28px 24px 28px;text-align:center;">
                <div style="font-size:48px;line-height:1;margin-bottom:12px;">💜</div>
                <h1 style="font-size:24px;font-weight:800;color:#1A1A2E;margin:0 0 8px 0;line-height:1.2;">
                  ${t.title}
                </h1>
                <p style="font-size:15px;color:#5A5A75;margin:0;line-height:1.5;">
                  ${t.greeting(data.ownerName)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Item info card -->
      <tr>
        <td style="padding:16px 0 0 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#FFFFFF;border-radius:20px;border:2px solid #EBE5FF;">
            <tr>
              <td style="padding:24px 24px 8px 24px;">
                <p style="font-size:12px;color:#9999B0;text-transform:uppercase;letter-spacing:1px;font-weight:600;margin:0 0 4px 0;">
                  ${t.itemLabel}
                </p>
                <p style="font-size:20px;font-weight:700;color:#1A1A2E;margin:0;">
                  ${escapeHtml(data.itemName)}
                </p>
              </td>
            </tr>

            <tr><td style="padding:0 24px;"><hr style="border:none;border-top:1px solid #EBE5FF;margin:16px 0;"></td></tr>

            <!-- Message -->
            <tr>
              <td style="padding:0 24px 16px 24px;">
                <p style="font-size:12px;color:#9999B0;text-transform:uppercase;letter-spacing:1px;font-weight:600;margin:0 0 8px 0;">
                  ${t.messageLabel} 💬
                </p>
                <div style="background-color:#FFF9F0;border-radius:14px;padding:16px;">
                  <p style="font-size:15px;color:#2D2D45;margin:0;line-height:1.6;white-space:pre-wrap;font-style:italic;">
                    "${escapeHtml(data.finderMessage)}"
                  </p>
                </div>
              </td>
            </tr>

            <!-- Location -->
            <tr>
              <td style="padding:0 24px 16px 24px;">
                <p style="font-size:12px;color:#9999B0;text-transform:uppercase;letter-spacing:1px;font-weight:600;margin:0 0 8px 0;">
                  ${t.locationLabel} 📍
                </p>
                <p style="font-size:14px;color:#2D2D45;margin:0 0 8px 0;line-height:1.5;">
                  ${escapeHtml(data.finderLocation)}
                </p>
                ${
                  mapUrl
                    ? `<a href="${mapUrl}" style="display:inline-block;font-size:13px;color:#8B7FD9;font-weight:600;text-decoration:none;">${t.viewOnMap} ↗</a>`
                    : ''
                }
              </td>
            </tr>

            ${
              data.finderName || data.finderContact
                ? `
            <tr>
              <td style="padding:0 24px 16px 24px;">
                <p style="font-size:12px;color:#9999B0;text-transform:uppercase;letter-spacing:1px;font-weight:600;margin:0 0 8px 0;">
                  ${t.finderLabel} 👋
                </p>
                ${
                  data.finderName
                    ? `<p style="font-size:14px;color:#2D2D45;margin:0 0 4px 0;line-height:1.5;"><strong>${escapeHtml(data.finderName)}</strong></p>`
                    : ''
                }
                ${
                  data.finderContact
                    ? `<p style="font-size:13px;color:#5A5A75;margin:0;line-height:1.5;">${escapeHtml(data.finderContact)}</p>`
                    : ''
                }
              </td>
            </tr>
                `
                : ''
            }

            <!-- CTA -->
            <tr>
              <td style="padding:8px 24px 28px 24px;text-align:center;">
                <a href="${data.itemDetailUrl}"
                   style="display:inline-block;background-color:#8B7FD9;color:#FFFFFF;text-decoration:none;padding:14px 28px;border-radius:9999px;font-size:15px;font-weight:600;">
                  ${t.cta} →
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Encouragement footer -->
      <tr>
        <td style="padding:24px 12px;text-align:center;">
          <p style="font-size:13px;color:#5A5A75;margin:0;line-height:1.6;">
            ${t.encouragement}
          </p>
        </td>
      </tr>

      <!-- Brand footer -->
      <tr>
        <td style="padding:0 12px 24px 12px;text-align:center;border-top:1px solid #EBE5FF;padding-top:20px;">
          <p style="font-size:12px;color:#9999B0;margin:0 0 4px 0;">
            ${t.madeWith} 💜 ${t.byTeam} 🇮🇩
          </p>
          <p style="font-size:11px;color:#9999B0;margin:0;">
            ${t.disclaimer}
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;

  // Plain text fallback
  const text = `${t.title}

${t.greeting(data.ownerName)}

${t.itemLabel}: ${data.itemName}

${t.messageLabel}:
"${data.finderMessage}"

${t.locationLabel}: ${data.finderLocation}
${mapUrl ? `${t.viewOnMap}: ${mapUrl}` : ''}

${data.finderName ? `${t.finderLabel}: ${data.finderName}` : ''}
${data.finderContact ? `${t.finderLabel}: ${data.finderContact}` : ''}

${t.cta}: ${data.itemDetailUrl}

${t.encouragement}

—
${t.madeWith} 💜 ${t.byTeam} 🇮🇩
${t.disclaimer}
`;

  return { subject, html, text };
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// === Translations ===
const translations = {
  id: {
    subject: (itemName: string) => `💜 Seseorang menemukan ${itemName}!`,
    title: 'Ada kabar baik! 🎉',
    greeting: (name: string) =>
      `Halo ${name}, seseorang baru saja melaporkan menemukan barangmu via Mimoo. Yuk cek detailnya:`,
    itemLabel: 'Barang',
    messageLabel: 'Pesan dari penemu',
    locationLabel: 'Lokasi ditemukan',
    finderLabel: 'Dari',
    viewOnMap: 'Lihat di Maps',
    cta: 'Buka di Dashboard',
    encouragement:
      'Cepat hubungi mereka ya! Kami doakan barangmu kembali dengan aman 🫶',
    madeWith: 'Dibuat dengan',
    byTeam: 'oleh tim Mimoo di Indonesia',
    disclaimer:
      'Email ini terkirim karena seseorang scan QR Mimoo-mu. Aman & rahasia.',
  },
  en: {
    subject: (itemName: string) => `💜 Someone found your ${itemName}!`,
    title: 'Great news! 🎉',
    greeting: (name: string) =>
      `Hi ${name}, someone just reported finding your item via Mimoo. Here are the details:`,
    itemLabel: 'Item',
    messageLabel: 'Message from finder',
    locationLabel: 'Location found',
    finderLabel: 'From',
    viewOnMap: 'View on Maps',
    cta: 'Open in Dashboard',
    encouragement:
      "Reach out to them quickly! We're rooting for a safe reunion 🫶",
    madeWith: 'Made with',
    byTeam: 'by the Mimoo team in Indonesia',
    disclaimer:
      'You received this because someone scanned your Mimoo QR. Safe & private.',
  },
};
