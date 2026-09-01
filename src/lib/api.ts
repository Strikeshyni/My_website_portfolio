const normalizedApiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const normalizedWsBase = (import.meta.env.VITE_WS_BASE_URL || '').replace(/\/$/, '');

export const API_BASE_URL = normalizedApiBase;

export const apiUrl = (path: string): string => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const wsUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (normalizedWsBase) {
    return `${normalizedWsBase}${normalizedPath}`;
  }

  if (API_BASE_URL) {
    const base = API_BASE_URL.replace(/^http/, 'ws');
    return `${base}${normalizedPath}`;
  }

  const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${scheme}://${window.location.host}${normalizedPath}`;
};
