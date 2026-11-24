import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { ArrowRight } from './Icon';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: 'primary' | 'ghost'; children: ReactNode };

export default function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  return (
    <a className={`btn btn-${variant} ${className}`} {...rest}>
      <span>{children}</span>
      <ArrowRight size={18} aria-hidden="true" />
    </a>
  );
}
