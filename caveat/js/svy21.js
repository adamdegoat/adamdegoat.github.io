/* Caveat — SVY21 (EPSG:3414) <-> WGS84 lat/lng, for the map.
   Forward is the exact transverse-Mercator (matches data/svy21.py, validated to
   ~8cm). Inverse is by Newton-style iteration on the forward — converges to
   sub-metre in ~5 steps, plenty for plotting pins. */
const SVY21 = (() => {
  const A = 6378137.0, F = 1 / 298.257223563;
  const O_LAT = 1.366666 * Math.PI / 180, O_LNG = 103.833333 * Math.PI / 180;
  const FE = 28001.642, FN = 38744.572, K0 = 1.0;
  const b = A * (1 - F), e2 = (A * A - b * b) / (A * A), e4 = e2 * e2, e6 = e4 * e2;
  const A0 = 1 - e2 / 4 - 3 * e4 / 64 - 5 * e6 / 256;
  const A2 = (3 / 8) * (e2 + e4 / 4 + 15 * e6 / 128);
  const A4 = (15 / 256) * (e4 + 3 * e6 / 4);
  const A6 = 35 * e6 / 3072;
  const M = lat => A * (A0 * lat - A2 * Math.sin(2 * lat) + A4 * Math.sin(4 * lat) - A6 * Math.sin(6 * lat));
  const M0 = M(O_LAT);

  function toSVY21(latDeg, lngDeg) {
    const lat = latDeg * Math.PI / 180, s = Math.sin(lat), cl = Math.cos(lat), t = Math.tan(lat);
    const rho = A * (1 - e2) / Math.pow(1 - e2 * s * s, 1.5);
    const nu = A / Math.sqrt(1 - e2 * s * s);
    const psi = nu / rho, w = lngDeg * Math.PI / 180 - O_LNG;
    const N = FN + K0 * (M(lat) - M0
      + w * w / 2 * nu * s * cl
      + Math.pow(w, 4) / 24 * nu * s * Math.pow(cl, 3) * (4 * psi * psi + psi - t * t));
    const E = FE + K0 * nu * cl * w * (1
      + w * w / 6 * cl * cl * (psi - t * t)
      + Math.pow(w, 4) / 120 * Math.pow(cl, 4) * (4 * psi * psi * psi * (1 - 6 * t * t) + psi * psi * (1 + 8 * t * t) - psi * 2 * t * t + t * t * t * t));
    return [E, N];
  }

  // inverse by iteration (approx metres-per-degree near Singapore)
  function toLatLng(E, N) {
    let lat = 1.35, lng = 103.82; // SG centre seed
    for (let i = 0; i < 6; i++) {
      const [ec, nc] = toSVY21(lat, lng);
      lat += (N - nc) / 110900;
      lng += (E - ec) / (111320 * Math.cos(lat * Math.PI / 180));
    }
    return [lat, lng];
  }

  return { toSVY21, toLatLng };
})();
