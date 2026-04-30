const PROVIDERS = [
  'https://helldiverstrainingmanual.com/api/v1',
  'https://api.helldivers2.dev/api/v1'
];

async function fetchJson(path) {
  for (const base of PROVIDERS) {
    try {
      const res = await fetch(base + path, {
        headers: {
          'Accept': 'application/json',
          'X-Super-Client': 'SuperEarthCompanion'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {}
  }
  throw new Error(`Tutti i provider falliti per ${path}`);
}

async function getWarNews() {
  return fetchJson('/war/news');
}

async function getCampaign() {
  return fetchJson('/war/campaign');
}

async function getMajorOrders() {
  return fetchJson('/war/major-orders');
}

async function getPlanets() {
  return fetchJson('/planets');
}

module.exports = {
  getWarNews,
  getCampaign,
  getMajorOrders,
  getPlanets
};
