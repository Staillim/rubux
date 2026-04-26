const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export async function fetchRobloxUser(username) {
  const value = String(username || '').trim();
  if (!value) {
    throw new Error('Debes ingresar un username.');
  }

  const response = await fetch(`${API_BASE_URL}/api/roblox/user?username=${encodeURIComponent(value)}`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || 'No se pudo buscar el usuario.');
  }

  return payload;
}
