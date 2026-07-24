/* Caveat, interactive valuation map (Leaflet + OneMap tiles).
   Plots the subject, comparable sales and nearby amenities. All free. */
const CaveatMap = (() => {
  const maps = {};
  const _sw = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  const AMEN = {
    mrt: `<svg viewBox="0 0 24 24" width="16" height="16" ${_sw}><rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 10h14"/><path d="M8.5 19l-1.5 2.5M15.5 19l1.5 2.5"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>`,
    lrt: `<svg viewBox="0 0 24 24" width="16" height="16" ${_sw}><rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 10h14"/><path d="M8.5 19l-1.5 2.5M15.5 19l1.5 2.5"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>`,
    school: `<svg viewBox="0 0 24 24" width="16" height="16" ${_sw}><path d="M12 4 2 9l10 5 10-5-10-5z"/><path d="M6 11v5c0 1 3 2.5 6 2.5s6-1.5 6-2.5v-5"/></svg>`,
    hawker: `<svg viewBox="0 0 24 24" width="16" height="16" ${_sw}><path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M12 11V8M9 8c0-1.5 1-2 1.5-2.5M15 8c0-1.5-1-2-1.5-2.5"/><path d="M4 20h16"/></svg>`,
    park: `<svg viewBox="0 0 24 24" width="16" height="16" ${_sw}><path d="M12 22v-6"/><path d="M12 16a5 5 0 0 0 5-5 4 4 0 0 0-1-2.5A4.5 4.5 0 0 0 12 3a4.5 4.5 0 0 0-4 3.5A4 4 0 0 0 7 11a5 5 0 0 0 5 5z"/></svg>`,
  };
  const PIN = `<svg viewBox="0 0 24 24" width="16" height="16" ${_sw}><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>`;

  function subjectIcon(color) {
    return L.divIcon({ className: 'cm-sub', iconSize: [30, 30], iconAnchor: [15, 15],
      html: `<span style="background:${color}">★</span>` });
  }
  function amenIcon(kind) {
    return L.divIcon({ className: 'cm-amen', iconSize: [26, 26], iconAnchor: [13, 13],
      html: `<span>${AMEN[kind] || PIN}</span>` });
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
      L.marker(s.latlng, { icon: subjectIcon(opts.color || '#2E7D5B'), zIndexOffset: 1000 })
        .addTo(m).bindPopup(`<b>${s.label}</b><br><span style="color:#6b7587">Subject property</span>`);
      pts.push(s.latlng);
    }
    (opts.comps || []).forEach(c => {
      if (!c.latlng) return;
      L.circleMarker(c.latlng, { radius: 6, color: opts.color || '#2E7D5B', weight: 2, fillColor: '#fff', fillOpacity: 1 })
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
