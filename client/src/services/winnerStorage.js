const STORAGE_KEY = 'roblox_winners';

export function getWinners() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

export function saveWinners(winners) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(winners));
}

export function exportWinnersToJson(winners) {
  const data = JSON.stringify(winners, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `roblox_ganadores_${Date.now()}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 300);
}
