import { NextRequest } from 'next/server';
import { verifyTurnstile, readFormBody, formError as respond } from '@/lib/server/turnstile';

export async function POST(request: NextRequest) {
  const body = await readFormBody(request, 2000);
  if (body instanceof Response) return body;
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.consent !== true) return respond('Please enter a valid email and agree to newsletter emails.', 400);
  if (!await verifyTurnstile(request,body.captchaToken,'newsletter')) return respond('Please complete the verification and try again.',403);
  const key = process.env.BREVO_API_KEY?.trim();
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!key || !Number.isSafeInteger(listId) || listId < 1) return respond('Newsletter signup is temporarily unavailable. Please try again later.', 503);
  try {
    const result = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST', headers: { 'api-key': key, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
      signal: AbortSignal.timeout(15000), cache: 'no-store',
    });
    // Do not override existing unsubscribe/blacklist preferences or expose provider errors.
    if (!result.ok) return respond('We could not complete your signup. Please try again later.', result.status === 429 ? 429 : 502);
    return respond('Thank you. Your newsletter signup has been received.', 200);
  } catch { return respond('Newsletter signup is temporarily unavailable. Please try again later.', 502); }
}
