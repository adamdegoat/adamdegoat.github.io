/* Caveat — core: data loading, geocoding, amenities, formatting helpers. */
const Caveat = (() => {
  const DATA = 'data/';
  const cache = {};
  let INDEX = null, AMENITIES = null, RATES = null, RENTALS = null;

  async function getJSON(path) {
    if (cache[path]) return cache[path];
    const r = await fetch(DATA + path);
    if (!r.ok) throw new Error('Failed to load ' + path + ' (' + r.status + ')');
    const j = await r.json();
    cache[path] = j;
    return j;
  }

  // compact {fields, rows} -> array of objects
  function expand(tbl) {
    const f = tbl.fields;
    return tbl.rows.map(row => {
      const o = {};
      for (let i = 0; i < f.length; i++) o[f[i]] = row[i];
      return o;
    });
  }

  async function index() { return INDEX || (INDEX = await getJSON('index.json')); }
  async function rentals() { return RENTALS || (RENTALS = await getJSON('rentals.json')); }
  let HDBRENT = null, STREETS = null;
  async function hdbRent() { return HDBRENT || (HDBRENT = await getJSON('hdb_rent.json')); }
  async function hdbStreets() { return STREETS || (STREETS = expand(await getJSON('hdb_streets.json'))); }
  let LANDEDST = null;
  async function landedStreets() { return LANDEDST || (LANDEDST = expand(await getJSON('landed_streets.json'))); }

  // nearest amenities by distance band (e.g. schools within 1km / 1-2km)
  async function nearbyBand(x, y, kind, bands) {
    const am = (await amenities()).filter(a => a.kind === kind);
    const withD = am.map(a => ({ name: a.name, level: a.level, dist: Math.round(Math.hypot(a.x - x, a.y - y)) }))
      .sort((p, q) => p.dist - q.dist);
    const out = {};
    for (const b of bands) out[b] = withD.filter(a => a.dist <= b * 1000 && a.dist > (bands[bands.indexOf(b) - 1] || 0) * 1000);
    return out;
  }
  async function rates() { return RATES || (RATES = await getJSON('rates.json')); }
  async function amenities() {
    if (AMENITIES) return AMENITIES;
    AMENITIES = expand(await getJSON('amenities.json'));
    return AMENITIES;
  }
  async function hdbTown(town) { return expand(await getJSON('hdb/' + town.replace(/\//g, '-') + '.json')); }
  async function condoDistrict(d) { return expand(await getJSON('condo/D' + d + '.json')); }

  // ---- OneMap geocode (public, CORS-enabled) -> {address, lat, lng, svy_x, svy_y} ----
  async function geocode(q) {
    const url = 'https://www.onemap.gov.sg/api/common/elastic/search?searchVal=' +
      encodeURIComponent(q) + '&returnGeom=Y&getAddrDetails=Y&pageNum=1';
    const r = await fetch(url);
    if (!r.ok) throw new Error('Geocoding failed');
    const j = await r.json();
    const res = (j.results || [])[0];
    if (!res) return null;
    return {
      address: res.ADDRESS, postal: res.POSTAL, building: res.BUILDING,
      lat: +res.LATITUDE, lng: +res.LONGITUDE, svy_x: +res.X, svy_y: +res.Y,
    };
  }

  // nearest amenity per kind to subject SVY21 point
  async function nearby(x, y, opts = {}) {
    const radius = opts.radius || 2500, maxEach = opts.maxEach || 1;
    const am = await amenities();
    const byKind = {};
    for (const a of am) {
      const d = Math.hypot(a.x - x, a.y - y);
      if (d <= radius) (byKind[a.kind] = byKind[a.kind] || []).push({ name: a.name, level: a.level, dist: Math.round(d), x: a.x, y: a.y });
    }
    const out = {};
    for (const k in byKind) { byKind[k].sort((p, q) => p.dist - q.dist); out[k] = byKind[k].slice(0, maxEach); }
    return out;
  }

  // ---- formatting ----
  const fmtMoney = n => '$' + Math.round(n).toLocaleString('en-SG');
  const fmtK = n => '$' + (Math.round(n / 1000)).toLocaleString('en-SG') + 'k';
  const fmtPsf = n => '$' + Math.round(n).toLocaleString('en-SG') + ' psf';
  const SQM_SQF = 10.7639;
  const yymmNow = () => { const d = new Date(); return String(d.getFullYear() % 100).padStart(2, '0') + String(d.getMonth() + 1).padStart(2, '0'); };
  const yymmIdx = s => +s.slice(0, 2) * 12 + +s.slice(2); // months since year 2000
  const monthsBetween = (a, b) => Math.abs(yymmIdx(a) - yymmIdx(b));
  const median = arr => { const s = [...arr].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const leaseYears = m => m ? (m / 12).toFixed(1).replace(/\.0$/, '') : null;

  return { getJSON, expand, index, rates, rentals, hdbRent, hdbStreets, landedStreets, amenities, hdbTown, condoDistrict,
    geocode, nearby, nearbyBand, fmtMoney, fmtK, fmtPsf, SQM_SQF, yymmNow, yymmIdx,
    monthsBetween, median, leaseYears };
})();
