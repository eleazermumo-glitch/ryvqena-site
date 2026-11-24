/**
 * Optional email notification through the Resend HTTP API (no SDK, uses built-in fetch).
 * Set RESEND_API_KEY, MAIL_FROM and NOTIFY_TO to enable. Without them, enquiries are still stored.
 */
const oneLine = (s) => String(s).replace(/[\r\n]+/g, ' ').slice(0, 200);

export function createMailer({ apiKey, from, to }) {
  const enabled = Boolean(apiKey && from && to);
  return {
    enabled,
    async notify(inq) {
      if (!enabled) return false;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          from,
          to: to.split(',').map((s) => s.trim()).filter(Boolean),
          reply_to: inq.email,
          subject: oneLine(`New enquiry: ${inq.service} from ${inq.name}`),
          text: [
            `Name: ${inq.name}`,
            `Email: ${inq.email}`,
            `Organisation: ${inq.organisation || '-'}`,
            `Service: ${inq.service}`,
            '',
            inq.message,
            '',
            `Reference: #${inq.id}`,
          ].join('\n'),
        }),
      });
      if (!res.ok) throw new Error(`mail provider responded ${res.status}`);
      return true;
    },
  };
}
