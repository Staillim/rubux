function resolveUserEndpoint() {
  const envBase = String(import.meta.env.VITE_API_BASE_URL || '').trim();
  if (envBase) {
    return `${envBase.replace(/\/$/, '')}/api/roblox/user`;
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:3001/api/roblox/user';
    }
  }

  return '/.netlify/functions/roblox-user';
}

const USER_ENDPOINT = resolveUserEndpoint();

export async function fetchRobloxUser(username) {
  const value = String(username || '').trim();
  if (!value) {
    throw new Error('Debes ingresar un username.');
  }

  const response = await fetch(`${USER_ENDPOINT}?username=${encodeURIComponent(value)}`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || 'No se pudo buscar el usuario.');
  }

  return payload;
}
