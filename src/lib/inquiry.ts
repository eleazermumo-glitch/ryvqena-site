/** Tiny store that lets any button pre-select the service in the enquiry form. */
type Listener = (service: string) => void;

let pending: string | null = null;
const listeners = new Set<Listener>();

/** Call from a click handler; the form picks it up whether it is already mounted or not. */
export function inquire(service: string): void {
  pending = service;
  listeners.forEach((l) => l(service));
}

export function takePending(): string | null {
  const p = pending;
  pending = null;
  return p;
}

export function onInquire(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
