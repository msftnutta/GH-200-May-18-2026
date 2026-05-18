/**
 * Equirectangular projection helpers and stylized continent outlines.
 *
 * Map viewBox: 0 0 1000 500 (2:1)
 *   x = (lon + 180) * 1000 / 360
 *   y = (90 - lat)  * 500 / 180
 *
 * Continent polygons are intentionally LOW-RESOLUTION / STYLIZED — they
 * suggest land masses for visual context, not geographic accuracy.
 */

const MAP_W = 1000;
const MAP_H = 500;

function project(lon, lat) {
  const x = ((lon + 180) * MAP_W) / 360;
  const y = ((90 - lat) * MAP_H) / 180;
  return { x, y };
}

// Polygons defined as arrays of [lon, lat] points.
const CONTINENT_POLYGONS = {
  'North America': [
    [-168, 66], [-156, 71], [-128, 70], [-95, 73], [-82, 72], [-62, 60],
    [-55, 50], [-65, 44], [-80, 25], [-97, 18], [-106, 22], [-115, 30],
    [-125, 40], [-130, 54], [-145, 60], [-160, 60], [-168, 66]
  ],
  'South America': [
    [-80, 12], [-65, 10], [-50, 5], [-35, -5], [-38, -22], [-55, -35],
    [-65, -52], [-72, -52], [-75, -40], [-80, -20], [-82, -5], [-80, 12]
  ],
  'Europe': [
    [-10, 58], [0, 62], [12, 66], [25, 65], [40, 60], [45, 50], [40, 42],
    [22, 36], [10, 38], [-5, 36], [-10, 44], [-10, 58]
  ],
  'Africa': [
    [-17, 35], [10, 36], [30, 32], [38, 16], [52, 12], [50, -5], [42, -18],
    [30, -35], [18, -34], [10, -10], [-8, 5], [-15, 18], [-17, 35]
  ],
  'Asia': [
    [30, 70], [80, 78], [140, 75], [175, 70], [170, 60], [145, 45],
    [140, 32], [125, 22], [110, 8], [100, 4], [95, 18], [88, 22],
    [78, 8], [72, 18], [60, 25], [50, 28], [45, 42], [35, 45], [30, 55],
    [30, 70]
  ],
  'Australia': [
    [115, -12], [135, -12], [148, -18], [153, -28], [148, -38], [135, -36],
    [118, -34], [112, -22], [115, -12]
  ],
  'NewZealand': [
    [166, -46], [172, -41], [178, -38], [176, -46], [170, -47], [166, -46]
  ]
};

/**
 * Convert a polygon ([lon, lat] points) into an SVG path "M x y L x y ... Z".
 */
function polygonToPath(points) {
  return (
    points
      .map(([lon, lat], i) => {
        const { x, y } = project(lon, lat);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ') + ' Z'
  );
}

function continentPaths() {
  return Object.entries(CONTINENT_POLYGONS).map(([name, pts]) => ({
    name,
    d: polygonToPath(pts)
  }));
}

module.exports = { project, continentPaths, MAP_W, MAP_H };
