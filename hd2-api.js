const PROVIDERS = [
  'https://helldiverstrainingmanual.com/api/v1',
  'https://api.helldivers2.dev/api/v1'
];

async function fetchJson(path) {
  for (const base of PROVIDERS) {
    try {
      const res = await fetch(base + path, {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {}
  }
  throw new Error(`Provider falliti per ${path}`);
}

function normalizeArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

async function getWarNews() { return normalizeArray(await fetchJson('/war/news')); }
async function getCampaign() { return normalizeArray(await fetchJson('/war/campaign')); }
async function getMajorOrders() { return normalizeArray(await fetchJson('/war/major-orders')); }
async function getPlanets() { return normalizeArray(await fetchJson('/planets')); }

module.exports = { getWarNews, getCampaign, getMajorOrders, getPlanets };
