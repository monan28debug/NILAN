import { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const SiteContext = createContext(null);
export const useSite = () => useContext(SiteContext);

export function SiteProvider({ children }) {
  const [status, setStatus] = useState({ isWebsiteEnabled: true, maintenanceMessage: '' });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ref = doc(db, 'settings', 'websiteStatus');
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) setStatus(snap.data());
        setLoaded(true);
      },
      () => setLoaded(true)
    );
    return unsub;
  }, []);

  return <SiteContext.Provider value={{ ...status, loaded }}>{children}</SiteContext.Provider>;
}
