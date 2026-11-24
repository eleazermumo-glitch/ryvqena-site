import K from '../data/agent-knowledge.json';

export type Action = { label: string; href: string };
export type Reply = { text: string; actions?: Action[] };

const has = (q: string, words: string[]) => words.some((w) => q.includes(w));
const word = (q: string, re: RegExp) => re.test(q);
const contactActions: Action[] = [
  { label: 'Make an inquiry', href: '#contact' },
  { label: 'WhatsApp us', href: K.contact.whatsapp },
];

/** Answers from the site's own facts. Used when the AI service is not connected, so the assistant never goes silent and never invents anything. */
export function basicReply(input: string): Reply {
  const q = input.toLowerCase();
  const svc = K.services.find((s) => (s.id === 'ai' && word(q, /\bai\b/)) || (s.id === 'mobile' && word(q, /\b(apps?|ios)\b/)) || has(q, [...(s.id === 'ai' ? [] : [s.id]), s.name.toLowerCase(), ...(s.id === 'web' ? ['website', 'web site'] : []), ...(s.id === 'mobile' ? ['android', 'iphone', 'phone'] : []), ...(s.id === 'ai' ? ['artificial', 'automation', 'chatbot'] : []), ...(s.id === 'software' ? ['system', 'custom software'] : []), ...(s.id === 'consulting' ? ['consult', 'strategy', 'advice'] : [])]));
  const prod = K.products.find((p) => has(q, [p.id, p.name.toLowerCase(), ...(p.id === 'learning' ? ['learning', 'course'] : []), ...(p.id === 'garidoc' ? ['car', 'garage', 'vehicle'] : []), ...(p.id === 'vouchify' ? ['voucher', 'credential', 'verify'] : []), ...(p.id === 'earthtrace' ? ['environment', 'climate', 'air quality'] : [])]));

  if (has(q, ['price', 'cost', 'quote', 'how much', 'budget', 'bei', 'gharama'])) return { text: 'We do not publish prices. The team will give you a quote once they know what you want built. Tell us about your project and they will reply.', actions: contactActions };
  if (has(q, ['how long', 'timeline', 'deadline', 'weeks', 'months'])) return { text: 'Timelines depend on the project, so we do not quote one here. Tell us what you need and the team will say what is realistic.', actions: contactActions };
  if (has(q, ['start', 'begin', 'hire', 'work with', 'book', 'consultation', 'project', 'anza'])) return { text: 'Easy: send us a short description of what you want to build using the contact form, or message us on WhatsApp. We listen first, then agree the simplest approach that can work.', actions: contactActions };
  if (prod) {
    const href = (prod as { href?: string }).href;
    return { text: `${prod.name} (${prod.status}): ${prod.text}`, actions: href ? [{ label: `Open ${prod.name}`, href }] : undefined };
  }
  if (svc) return { text: `${svc.name}: ${svc.text}`, actions: contactActions };
  if (has(q, ['team', 'ceo', 'coo', 'founder', 'who runs', 'who are', 'staff'])) return { text: `The team: ${K.team.map((t) => `${t.name} (${t.role})`).join(', ')}.`, actions: [{ label: 'See the team', href: '#team' }] };
  if (has(q, ['contact', 'email', 'phone', 'call', 'whatsapp', 'reach', 'number'])) return { text: `Email ${K.contact.email} or call or WhatsApp ${K.contact.phone}.`, actions: contactActions };
  if (has(q, ['product', 'software you', 'what have you built'])) return { text: `Our products: ${K.products.map((p) => `${p.name} (${p.status})`).join(', ')}. GariDoc is the one you can try today.`, actions: [{ label: 'See products', href: '#products' }] };
  if (has(q, ['service', 'what do you', 'what can you', 'capabilit', 'offer', 'build', 'do you do'])) return { text: `We work in five areas: ${K.services.map((s) => s.name).join(', ')}. Ask me about any of them.`, actions: [{ label: 'See capabilities', href: '#capabilities' }] };
  if (has(q, ['about', 'ryvqena', 'company', 'habari', 'mambo', 'jambo']) || word(q, /\b(hi|hello|hey|who)\b/)) return { text: K.company, actions: contactActions };
  return { text: 'I do not have that information. The team can answer it directly, so please use the contact form, email or WhatsApp.', actions: contactActions };
}
