import { useEffect, useState, type FormEvent } from 'react';
import { onInquire, takePending } from '../lib/inquiry';
import { company, services } from '../data/site';

// Same-origin API served by backend/server.js unless a full URL is configured.
const ENDPOINT = (import.meta.env?.VITE_FORM_ENDPOINT as string | undefined)?.trim() || '/api/inquiries';

type Status = { kind: 'idle' | 'sending' | 'ok' | 'mail' | 'error'; msg?: string };
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export default function EnquiryForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<Errors>({});
  const [service, setService] = useState<string>(services[0]);

  // Pre-select the service when an "Inquire" button elsewhere on the site was clicked.
  useEffect(() => {
    const first = takePending();
    if (first && services.includes(first)) setService(first);
    return onInquire((s) => {
      if (services.includes(s)) setService(s);
    });
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get('website')) return; // honeypot: bots fill it, people never see it

    const data = {
      name: String(fd.get('name') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      organisation: String(fd.get('organisation') ?? '').trim(),
      service: String(fd.get('service') ?? ''),
      message: String(fd.get('message') ?? '').trim(),
    };
    const next: Errors = {};
    if (data.name.length < 2) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = 'Please enter a valid email address.';
    if (data.message.length < 10) next.message = 'Tell us a little more (at least a sentence).';
    setErrors(next);
    if (Object.keys(next).length) {
      (form.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus();
      return;
    }

    setStatus({ kind: 'sending' });
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, website: String(fd.get('website') ?? '') }),
      });
      if (res.status === 201) {
        form.reset();
        setService(services[0]);
        setStatus({ kind: 'ok', msg: 'Thank you. Your enquiry has been received and we will reply by email.' });
        return;
      }
      // The server answered but refused: show its reason instead of pretending it worked.
      if (res.status === 400 || res.status === 429 || res.status === 413) {
        const j = (await res.json().catch(() => ({}))) as { message?: string; errors?: Errors };
        if (j.errors) setErrors(j.errors);
        setStatus({ kind: 'error', msg: j.message || `We could not send that. Please email ${company.email}.` });
        return;
      }
      throw new Error(String(res.status));
    } catch {
      // No backend reachable (for example the site is on static hosting): hand it to the visitor's email app, and say so.
      const body = `Name: ${data.name}\nEmail: ${data.email}\nOrganisation: ${data.organisation || '-'}\nService: ${data.service}\n\n${data.message}`;
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`Project enquiry: ${data.service}`)}&body=${encodeURIComponent(body)}`;
      setStatus({ kind: 'mail', msg: `Our enquiry server could not be reached, so your email app should open with the message ready to send. If nothing opens, write to ${company.email}.` });
    }
  };

  return (
    <form className="form" onSubmit={submit} noValidate aria-describedby="form-status">
      <div className="field">
        <label htmlFor="f-name">Name</label>
        <input id="f-name" name="name" type="text" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
        {errors.name && <p className="err" id="e-name">{errors.name}</p>}
      </div>
      <div className="field">
        <label htmlFor="f-email">Email</label>
        <input id="f-email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined} />
        {errors.email && <p className="err" id="e-email">{errors.email}</p>}
      </div>
      <div className="field">
        <label htmlFor="f-org">Organisation <span>(optional)</span></label>
        <input id="f-org" name="organisation" type="text" autoComplete="organization" />
      </div>
      <div className="field">
        <label htmlFor="f-service">Service required</label>
        <select id="f-service" name="service" value={service} onChange={(e) => setService(e.target.value)}>
          {services.map((s) => (<option key={s}>{s}</option>))}
        </select>
      </div>
      <div className="field wide">
        <label htmlFor="f-msg">Project description</label>
        <textarea id="f-msg" name="message" rows={5} required aria-invalid={!!errors.message} aria-describedby={errors.message ? 'e-msg' : undefined} />
        {errors.message && <p className="err" id="e-msg">{errors.message}</p>}
      </div>
      <div className="hp" aria-hidden="true">
        <label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="form-foot wide">
        <button className="btn btn-primary" type="submit" disabled={status.kind === 'sending'}>
          <span>{status.kind === 'sending' ? 'Sending...' : 'Send enquiry'}</span>
        </button>
        <p className="fine">
          We reply by email. Your details are used only to answer this enquiry.
        </p>
      </div>
      <p id="form-status" className={`status ${status.kind}`} role="status" aria-live="polite">{status.msg}</p>
    </form>
  );
}
