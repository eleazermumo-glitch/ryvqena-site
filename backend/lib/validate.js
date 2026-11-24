// Keep SERVICES in sync with `services` in src/data/site.ts.
export const SERVICES = [
  'Web Development',
  'Artificial Intelligence',
  'Mobile Application',
  'Software Systems',
  'IT Consulting',
  'GariDoc demo',
  'Vouchify early interest',
  'Something else',
];
export const STATUSES = ['new', 'read', 'replied', 'archived'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v) => (typeof v === 'string' ? v.trim() : '');
const clean = (s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

/** Returns { ok:true, value } or { ok:false, errors:{field:message} }. */
export function validateInquiry(body) {
  const b = body && typeof body === 'object' ? body : {};
  const value = {
    name: clean(str(b.name)),
    email: clean(str(b.email)).toLowerCase(),
    organisation: clean(str(b.organisation)),
    service: str(b.service),
    message: clean(str(b.message)),
  };
  const errors = {};
  if (value.name.length < 2 || value.name.length > 120) errors.name = 'Please enter your name.';
  if (!EMAIL.test(value.email) || value.email.length > 200) errors.email = 'Please enter a valid email address.';
  if (value.organisation.length > 160) errors.organisation = 'Organisation is too long.';
  if (!SERVICES.includes(value.service)) errors.service = 'Please choose a service.';
  if (value.message.length < 10) errors.message = 'Tell us a little more (at least a sentence).';
  if (value.message.length > 4000) errors.message = 'Message is too long (4000 characters maximum).';
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}
