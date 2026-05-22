const TWOGIS_KEY = 'f750fad1-d911-4d8f-86ec-c6a711f00590';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint, ...params } = req.query;

  const ALLOWED = {
    geocode: 'https://catalog.api.2gis.com/3.0/items/geocode',
    search:  'https://catalog.api.2gis.com/3.0/items',
  };

  if (!endpoint || !ALLOWED[endpoint]) {
    return res.status(400).json({ error: 'Неизвестный endpoint' });
  }

  const searchParams = new URLSearchParams({ ...params, key: TWOGIS_KEY });
  const url = `${ALLOWED[endpoint]}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'fitness-analyzer/1.0' },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
