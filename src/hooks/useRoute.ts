import { useEffect, useState } from 'react';

export type Route = 'home' | 'garidoc' | 'vouchify' | 'academy';

const read = (): Route => {
  const h = window.location.hash;
  return h === '#/garidoc' ? 'garidoc' : h === '#/vouchify' ? 'vouchify' : h === '#/academy' ? 'academy' : 'home';
};

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
