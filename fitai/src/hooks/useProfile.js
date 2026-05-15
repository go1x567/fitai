import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from './useAuth.jsx';

const DEBOUNCE_MS = 600;

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const dirtyRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!user) { setProfile(null); setLoaded(false); return; }
    let cancelled = false;
    api.getProfile()
      .then((p) => { if (!cancelled) { setProfile(p); setLoaded(true); } })
      .catch(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [user?.id]);

  const patch = (data) => {
    setProfile((cur) => ({ ...(cur ?? {}), ...data }));
    dirtyRef.current = { ...(dirtyRef.current ?? {}), ...data };
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const payload = dirtyRef.current;
      dirtyRef.current = null;
      if (payload && user) api.updateProfile(payload).catch(() => {});
    }, DEBOUNCE_MS);
  };

  return { profile, loaded, patch };
}
