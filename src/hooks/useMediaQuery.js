import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event) => setMatches(event.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export function useIsSlowConnection() {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (!conn) return;

    const checkConnection = () => {
      const slowTypes = ['slow-2g', '2g', '3g'];
      setIsSlow(
        Boolean(conn.saveData) || slowTypes.includes(conn.effectiveType)
      );
    };

    checkConnection();
    conn.addEventListener?.('change', checkConnection);
    return () => conn.removeEventListener?.('change', checkConnection);
  }, []);

  return isSlow;
}
