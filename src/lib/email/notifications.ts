import { getResendClient, getEmailConfig, formatFrom } from './client';
import { renderFinderReportEmail } from './templates';
import type { FinderReport } from '@/lib/items/types';

interface SendFinderReportEmailInput {
  ownerEmail: string;
  ownerName: string;
  ownerLocale: 'id' | 'en';
  itemName: string;
  itemId: string;
  report: Pick<
    FinderReport,
    'message' | 'location_text' | 'location_lat' | 'location_lng' | 'finder_name' | 'finder_contact'
  >;
}

/**
 * Send email notification to owner when a finder report is submitted.
 * Returns void — never throws. Failures logged but don't block app flow.
 *
 * Will silently no-op if RESEND_API_KEY is not configured.
 */
export async function sendFinderReportEmail(input: SendFinderReportEmailInput): Promise<void> {
  const resend = getResendClient();

  // Graceful no-op kalau Resend belum di-setup
  if (!resend) {
    console.info(
      '[email] RESEND_API_KEY not set — skipping finder report email (dev mode OK)'
    );
    return;
  }

  const { appUrl } = getEmailConfig();
  const itemDetailUrl = `${appUrl}/${input.ownerLocale}/dashboard/items/${input.itemId}`;

  const { subject, html, text } = renderFinderReportEmail({
    ownerName: input.ownerName,
    itemName: input.itemName,
    finderMessage: input.report.message,
    finderLocation: input.report.location_text,
    finderName: input.report.finder_name,
    finderContact: input.report.finder_contact,
    hasGpsLocation: !!(input.report.location_lat && input.report.location_lng),
    gpsLat: input.report.location_lat,
    gpsLng: input.report.location_lng,
    itemDetailUrl,
    locale: input.ownerLocale,
  });

  try {
    const result = await resend.emails.send({
      from: formatFrom(),
      to: input.ownerEmail,
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error('[email] Resend error:', result.error);
    } else {
      console.info('[email] Sent finder report email:', result.data?.id);
    }
  } catch (error) {
    // Email failures NEVER break the finder flow
    console.error('[email] Send failed (non-fatal):', error);
  }
}
