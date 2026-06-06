let rawApiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

if (rawApiBase.startsWith('http://') && rawApiBase.includes('onrender.com')) {
  rawApiBase = rawApiBase.replace('http://', 'https://');
}

export const apiBase = rawApiBase.replace(/\/+$/, '');
