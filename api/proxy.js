export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST → Overpass API (OpenStreetMap) — данные о конкурентах и инфраструктуре
  if (req.method === 'POST') {
    const body = req.body || {};
    const { data } = body;
    if (!data) return res.status(400).json({ error: 'data parameter required' });
    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'fitness-analyzer/1.0',
        },
        body: 'data=' + encodeURIComponent(data),
      });
      const json = await response.json();
      return res.status(response.status).json(json);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET → Nominatim (геокодинг адреса → координаты)
  const { endpoint, ...params } = req.query;

  if (endpoint === 'nominatim') {
    const searchParams = new URLSearchParams({ ...params, format: 'json' });
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${searchParams}`, {
        headers: { 'User-Agent': 'fitness-analyzer/1.0' },
      });
      const json = await response.json();
      return res.status(response.status).json(json);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: 'Неизвестный endpoint' });
}
