import { useEffect, useRef, useState, type FormEvent } from 'react';
import { basicReply, type Action } from '../lib/agentBasic';
import { company } from '../data/site';
import { MessageCircle, X, ArrowRight } from './Icon';

type Msg = { role: 'user' | 'assistant'; content: string; actions?: Action[] };
const ENDPOINT = (import.meta.env?.VITE_AGENT_ENDPOINT as string | undefined)?.trim() || '/api/agent';
const STARTERS = ['What do you build?', 'Tell me about GariDoc', 'How do I start a project?'];
const GREETING: Msg = { role: 'assistant', content: 'Hi, I am the Ryvqena assistant. Ask me about our services, our products or how to start a project.' };

export default function Agent() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<'ai' | 'basic' | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [msgs, busy]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); opener.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const ask = async (q: string) => {
    const question = q.trim().slice(0, 800);
    if (!question || busy) return;
    const next: Msg[] = [...msgs, { role: 'user', content: question }];
    setMsgs(next);
    setText('');
    setBusy(true);
    let answer: Msg | null = null;
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ messages: next.slice(1).map(({ role, content }) => ({ role, content })) }),
      });
      if (res.status === 429) {
        const j = (await res.json().catch(() => ({}))) as { message?: string };
        answer = { role: 'assistant', content: j.message || 'Too many questions for now. Please contact us directly.', actions: [{ label: 'WhatsApp us', href: company.whatsapp }] };
      } else if (res.ok) {
        const j = (await res.json()) as { mode?: string; reply?: string };
        if (j.mode === 'ai' && j.reply) { setMode('ai'); answer = { role: 'assistant', content: j.reply }; }
      }
    } catch { /* no server reachable: answer from built-in facts below */ }
    if (!answer) {
      const r = basicReply(question);
      setMode('basic');
      answer = { role: 'assistant', content: r.text, actions: r.actions };
    }
    setMsgs([...next, answer]);
    setBusy(false);
  };

  const submit = (e: FormEvent) => { e.preventDefault(); void ask(text); };
  const go = () => setOpen(false);

  return (
    <div className="agent">
      {open && (
        <section className="agent-panel" role="dialog" aria-label="Ryvqena assistant">
          <header>
            <div><b>Ask Ryvqena</b><span>{mode === 'ai' ? 'AI assistant' : mode === 'basic' ? 'Quick answers' : 'Assistant'}</span></div>
            <button type="button" className="agent-x" onClick={() => { setOpen(false); opener.current?.focus(); }} aria-label="Close assistant"><X size={20} aria-hidden="true" /></button>
          </header>
          <div className="agent-log" ref={log} role="log" aria-live="polite" aria-label="Conversation">
            {msgs.map((m, i) => (
              <div key={i} className={`agent-msg ${m.role}`}>
                <p>{m.content}</p>
                {m.actions && (
                  <div className="agent-actions">
                    {m.actions.map((a) => (
                      <a key={a.label} href={a.href} onClick={go} {...(a.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{a.label}<ArrowRight size={14} aria-hidden="true" /></a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && <div className="agent-msg assistant"><p className="agent-typing" aria-label="Thinking">...</p></div>}
            {msgs.length === 1 && (
              <div className="agent-starters">{STARTERS.map((s) => (<button key={s} type="button" onClick={() => void ask(s)}>{s}</button>))}</div>
            )}
          </div>
          <form onSubmit={submit}>
            <label className="sr-only" htmlFor="agent-in">Your question</label>
            <input id="agent-in" ref={input} value={text} onChange={(e) => setText(e.target.value)} maxLength={800} placeholder="Type your question" autoComplete="off" />
            <button type="submit" disabled={busy || !text.trim()}>Send</button>
          </form>
          <p className="agent-note">Answers can be wrong. For quotes and decisions, talk to the team.</p>
        </section>
      )}
      <button ref={opener} type="button" className="agent-fab" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close assistant' : 'Ask Ryvqena'}>
        {open ? <X size={24} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}
        {!open && <span>Ask Ryvqena</span>}
      </button>
    </div>
  );
}
