// shared/OfflineBanner.tsx — Shows banner when device goes offline
// D55: sem rede o app segue vivo — HOJE lê do tronco de bolso, a boca
// enfileira. O banner diz isso; estado, nunca alarme (D46).
import { useState, useEffect } from 'react';

export function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="bg-warning-bg text-warning-text text-xs font-medium text-center py-2 px-4 border-b border-warning/25">
      sem rede — o que você despejar fica na fila e sobe quando voltar
    </div>
  );
}
