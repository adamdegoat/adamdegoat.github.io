/* Caveat — interactive valuation map (Leaflet + OneMap tiles).
   Plots the subject, comparable sales and nearby amenities. All free. */
const CaveatMap = (() => {
  const maps = {};
  const AMEN = { mrt: '🚇', lrt: '🚈', school: '🎓', hawker: '🍜', park: '🌳' };

  function subjectIcon(color) {
    return L.divIcon({ className: 'cm-sub', iconSize: [30, 30], iconAnchor: [15, 15],
      html: `<span style="background:${color}">★</span>` });
  }
  function amenIcon(kind) {
    return L.divIcon({ className: 'cm-amen', iconSize: [26, 26], iconAnchor: [13, 13],
      html: `<span>${AMEN[kind] || '📍'}</span>` });
  }

  // opts: {subject:{latlng,label}, comps:[{latlng,label,sub}], amenities:[{kind,name,latlng,dist}], color}
  function render(elId, opts) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (typeof L === 'undefined') { el.innerHTML = '<p class="hint">Map could not load.</p>'; return; }
    if (maps[elId]) { maps[elId].remove(); delete maps[elId]; }

    const m = L.map(el, { zoomControl: true, scrollWheelZoom: false, attributionControl: true });
    maps[elId] = m;
    L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default_HD/{z}/{x}/{y}.png', {
      detectRetina: true, maxZoom: 19, minZoom: 11,
      attribution: '&copy; <a href="https://www.onemap.gov.sg/" target="_blank">OneMap</a> &copy; SLA',
    }).addTo(m);

    const pts = [];
    const s = opts.subject;
    if (s && s.latlng) {
      L.marker(s.latlng, { icon: subjectIcon(opts.color || '#0f9d76'), zIndexOffset: 1000 })
        .addTo(m).bindPopup(`<b>${s.label}</b><br><span style="color:#6b7587">Subject property</span>`);
      pts.push(s.latlng);
    }
    (opts.comps || []).forEach(c => {
      if (!c.latlng) return;
      L.circleMarker(c.latlng, { radius: 6, color: opts.color || '#0f9d76', weight: 2, fillColor: '#fff', fillOpacity: 1 })
        .addTo(m).bindPopup(`<b>${c.label}</b><br><span style="color:#6b7587">${c.sub}</span>`);
      pts.push(c.latlng);
    });
    (opts.amenities || []).forEach(a => {
      if (!a.latlng) return;
      L.marker(a.latlng, { icon: amenIcon(a.kind) }).addTo(m)
        .bindPopup(`<b>${a.name}</b><br><span style="color:#6b7587">${a.label} · ${a.dist}m</span>`);
      pts.push(a.latlng);
    });

    if (pts.length) m.fitBounds(L.latLngBounds(pts).pad(0.25));
    else m.setView([1.3521, 103.8198], 12);
    // only resize if this map is still the live one (a new valuation may have replaced it)
    setTimeout(() => { if (maps[elId] === m && el.isConnected) { try { m.invalidateSize(); } catch (e) {} } }, 120);
  }

  return { render };
})();
