let rawApiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').trim();

if (!rawApiBase.startsWith('http://') && !rawApiBase.startsWith('https://')) {
  if (rawApiBase.includes('localhost') || rawApiBase.includes('127.0.0.1')) {
    rawApiBase = 'http://' + rawApiBase;
  } else {
    rawApiBase = 'https://' + rawApiBase;
  }
}

if (rawApiBase.startsWith('http://') && rawApiBase.includes('onrender.com')) {
  rawApiBase = rawApiBase.replace('http://', 'https://');
}

export const apiBase = rawApiBase.replace(/\/+$/, '');

