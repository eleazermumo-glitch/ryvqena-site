export const company = {
  name: 'Ryvqena Tech',
  tagline: 'Technology Beyond the Expected',
  email: 'ryvqenatech@gmail.com',
  phone: '+254 181 167 607',
  whatsapp: 'https://wa.me/254181167607',
  whatsappBook: 'https://wa.me/254181167607?text=' + encodeURIComponent('Hello Ryvqena Tech, I would like to book a consultation about a project.'),
  /** Add real profile URLs here, e.g. { label: 'LinkedIn', href: 'https://...' }. Nothing renders while empty. */
  socials: [] as { label: string; href: string }[],
};

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'approach', label: 'Approach' },
  { id: 'team', label: 'Team' },
  { id: 'contact', label: 'Contact' },
] as const;

/** Shown in the hero strip. Same five disciplines as the Capabilities section. */
export const heroServices = [
  { title: 'Web Development', line: 'Build. Scale. Innovate.' },
  { title: 'AI Solutions', line: 'Smarter tomorrow.' },
  { title: 'Mobile Applications', line: 'Connect anywhere.' },
  { title: 'Software Systems', line: 'Power your vision.' },
  { title: 'IT Consulting', line: 'Strategic growth.' },
] as const;

export const principles = [
  { title: 'Start from the problem', text: 'We question the default and look for the smarter approach before a line of code is written.' },
  { title: 'Build it to last', text: 'Clean, maintainable engineering that holds up when real people depend on it.' },
  { title: 'Use intelligence where it helps', text: 'Software and AI are instruments. We use them where they genuinely make things better.' },
  { title: 'Design for people', text: 'Plain language, clear screens and respect for the person on the other side.' },
  { title: 'Keep improving', text: 'We ship, listen, learn and refine, again and again.' },
];

export const values = [
  { title: 'Innovation', text: 'We look for the better way before we reach for the usual one.' },
  { title: 'Integrity', text: 'We are honest about what our technology can and cannot do.' },
  { title: 'Excellence', text: 'Careful engineering and attention to the details users feel.' },
  { title: 'People first', text: 'Technology should make life simpler for the person using it.' },
];

export type Capability = {
  id: 'web' | 'ai' | 'mobile' | 'software' | 'consulting';
  title: string;
  summary: string;
  details: string[];
};

export const capabilities: Capability[] = [
  { id: 'web', title: 'Web Development', summary: 'Modern, responsive and scalable websites and web applications, built for speed, clarity and longevity.',
    details: ['Company websites and product sites', 'Web applications and dashboards', 'Accessibility, SEO and performance as defaults', 'APIs and third-party integrations'] },
  { id: 'ai', title: 'Artificial Intelligence', summary: 'Intelligent solutions, automation and AI-powered systems that remove repetitive work and make products easier to use.',
    details: ['Natural-language understanding for plain-language input', 'Workflow and process automation', 'AI features inside existing products', 'Honest scoping of what AI can and cannot do'] },
  { id: 'mobile', title: 'Mobile Applications', summary: 'Powerful mobile experiences designed phone-first for modern users, with smooth interaction and clear flows.',
    details: ['Phone-first interface design', 'Android and iOS delivery', 'Offline-aware and low-bandwidth thinking', 'Touch interaction and small-screen clarity'] },
  { id: 'software', title: 'Software Systems', summary: 'Custom software that improves organisational efficiency and operations, from internal tools to enterprise systems.',
    details: ['Custom business and operations software', 'Data models, reporting and workflows', 'Secure, scalable foundations', 'Documentation and handover'] },
  { id: 'consulting', title: 'IT Consulting', summary: 'Technology strategy, digital transformation and technical expertise to help organisations choose and plan well.',
    details: ['Technology strategy and roadmaps', 'Digital transformation planning', 'Solution architecture review', 'Practical, vendor-neutral advice'] },
];

export type Product = {
  slug: 'garidoc' | 'vouchify';
  name: string;
  descriptor: string;
  status: string;
  live: boolean;
  headline: string;
  card: string;
  summary: string;
  featuresTitle: string;
  features: { title: string; text: string }[];
  caveat: string;
};

export const garidoc = {
  name: 'GariDoc',
  status: 'Live demo',
  summary: 'A vehicle health hub for drivers in Kenya. Describe a problem in plain English or Swahili and get likely causes, an urgency label and a cost estimate in Kenyan shillings, then find a garage you can book.',
  features: [
    { title: 'Diagnose', text: 'Describe the problem and get likely causes, an urgency label and a KES estimate.' },
    { title: 'Codes', text: 'Decode an OBD-II fault code into plain language with advice.' },
    { title: 'Garages', text: 'Filter garages by what you need fixed and send a booking request.' },
    { title: 'Service log', text: "Your car's service history with a shareable QR code." },
    { title: 'Fleet', text: 'See what is overdue or due soon across every vehicle you look after.' },
    { title: 'Reminders', text: 'Insurance, inspection, service, licence and permit reminders.' },
  ],
  caveat: 'Cost figures are rough estimates. A qualified mechanic must inspect the car before any repair. In the live demo, accounts and history are stored on the visitor’s own device.',
};

export const caseStudies = [
  {
    id: 'garidoc',
    kind: 'Product initiative',
    status: 'Live demo',
    title: 'GariDoc',
    summary: 'A first opinion for drivers before the garage gives theirs.',
    problem: 'Drivers hear a noise and guess. They rarely know what it might be, how urgent it is or what a fair repair should cost.',
    approach: 'A plain-language diagnosis flow in English and Swahili, with likely causes, urgency, a KES estimate, a garage directory and a service log.',
    state: 'Live as a demo. Estimates only, and a mechanic always has the final word.',
    href: '#/garidoc',
  },
];

export const stages = [
  { n: '01', title: 'Discover', text: 'We listen first: the problem, the people involved and the constraints that shape the answer.' },
  { n: '02', title: 'Define', text: 'We choose the simplest approach that can work, agree the scope and decide what to build first.' },
  { n: '03', title: 'Design', text: 'Interfaces and architecture are designed together, so the system feels as sound as it looks.' },
  { n: '04', title: 'Engineer', text: 'We build with clean, maintainable code and care for the details people feel.' },
  { n: '05', title: 'Deploy & improve', text: 'We launch, document the work and stay close, refining it as real use teaches us more.' },
];

export const services = ['Web Development', 'Artificial Intelligence', 'Mobile Application', 'Software Systems', 'IT Consulting', 'GariDoc demo', 'Vouchify early interest', 'Something else'];

/** Shortcuts shown in the hero. Each one pre-selects the matching service in the enquiry form. */
export const inquiryOptions = [
  { label: 'Web development', service: 'Web Development' },
  { label: 'Artificial intelligence', service: 'Artificial Intelligence' },
  { label: 'Mobile apps', service: 'Mobile Application' },
  { label: 'Software systems', service: 'Software Systems' },
  { label: 'IT consulting', service: 'IT Consulting' },
];

export const vouchify: Product = {
  slug: 'vouchify',
  name: 'Vouchify',
  descriptor: 'Digital Vouching System',
  status: 'In development',
  live: false,
  headline: 'Vouchify: streamlined digital verification',
  card: 'A secure platform for issuing and checking digital vouchers, credentials and identity validation.',
  summary:
    'Vouchify is a digital vouching system in development at Ryvqena Tech. The idea is simple: an institution issues a credential once, and anyone who needs to trust it can check it instantly.',
  featuresTitle: 'Planned capabilities',
  features: [
    { title: 'Issue', text: 'Institutions create and send verifiable digital credentials and vouchers.' },
    { title: 'Verify', text: 'Employers and other parties check a credential instantly, without phone calls or paper.' },
    { title: 'Manage', text: 'Keep a clear record of what was issued, to whom and when.' },
  ],
  caveat: 'Vouchify is in development and is not available to the public yet. Scope and details may change before launch.',
};

export const garidocProduct: Product = {
  slug: 'garidoc',
  name: 'GariDoc',
  descriptor: 'Vehicle Health Platform',
  status: 'Live demo',
  live: true,
  headline: 'GariDoc: a first opinion before the garage',
  card: 'Describe a car problem in plain English or Swahili and get likely causes, urgency and a KES estimate.',
  summary: garidoc.summary,
  featuresTitle: 'What you can do',
  features: garidoc.features,
  caveat: garidoc.caveat,
};

export const products: Product[] = [garidocProduct, vouchify];

/** Early product ideas shown with the artwork supplied for them. No product pages exist yet, so these cards do not link anywhere. */
export const concepts = [
  {
    slug: 'learning-hub',
    name: 'Ryvqena Learning Hub',
    descriptor: 'Learning platform',
    status: 'Beta',
    headline: 'A personal learning dashboard',
    card: 'Guided modules and certification paths, from AI and machine-learning fundamentals to cloud architecture.',
  },
  {
    slug: 'earthtrace',
    name: 'EarthTrace',
    descriptor: 'Environmental intelligence',
    status: 'Concept',
    headline: 'A global view of the environment',
    card: 'A dashboard for atmospheric composition, air quality, ocean health and biodiversity, on phone, tablet and screen.',
  },
] as const;

/** Photos are shown as supplied. Only the CSS crop position differs, so each face sits well in the frame. */
export const team = [
  { name: 'Allan Mogunde', role: 'CEO', photo: '/images/team-allan-mogunde.webp', w: 900, h: 1200, pos: '50% 38%' },
  { name: 'Allan Jason', role: 'COO', photo: '/images/team-allan-jason.webp', w: 900, h: 1193, pos: '50% 16%' },
  { name: 'Irene Kiragu', role: 'Head of Sales and Business Development', photo: '/images/team-irene-kiragu.webp', w: 675, h: 1200, pos: '50% 24%' },
  { name: 'Natasha Mugo', role: 'Financial Administrator', photo: '/images/team-natasha-mugo.webp', w: 900, h: 675, pos: '50% 30%' },
  { name: 'Phoebe Mathenge', role: 'Chief Financial Officer', photo: '/images/team-phoebe-mathenge.webp', w: 900, h: 675, pos: '48% 30%' },
  { name: 'Nduta Gitau', role: 'Human Resources', photo: '/images/team-nduta-gitau.webp', w: 900, h: 506, pos: '52% 42%' },
] as const;

/** Supplied brand artwork, shown as given. */
export const logos: Record<string, { src: string; alt: string; w: number; h: number }> = {
  garidoc: { src: '/images/logo-garidoc.jpg', alt: 'GariDoc logo: a smiling car inside a shield with a heartbeat line. Your car’s health hub.', w: 1408, h: 768 },
  vouchify: { src: '/images/logo-vouchify.jpg', alt: 'Vouchify logo: a metallic R with an orbit beside the Vouchify name, with scales of justice, a seal and a gavel, on black marble.', w: 1024, h: 1024 },
  'learning-hub': { src: '/images/logo-academy.jpg', alt: 'Ryvqena Academy logo: a blue and silver R with an orbit, light bulb and graduation cap. Learn, create, innovate.', w: 1024, h: 1024 },
};
