import type { ReactNode } from 'react';

export default function SectionHead({ label, title, id }: { index?: string; label: string; title: ReactNode; id?: string }) {
  return (
    <header className="sec-head">
      <p className="sec-label">{label}</p>
      <h2 id={id} className="sec-title">{title}</h2>
    </header>
  );
}
