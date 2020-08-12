class SVG {
  constructor(width, height) {
    this.svg = htmlToElement(`
      <svg
        width=${width}
        height=${height}
      ></svg>
    `);
  }

  addPolygon(points, fill) {
    const color = fill || 'black';
    const loc = points.map(p => p.join(',')).join(' ');
    this.svg.insertAdjacentHTML('beforeend', `
      <polygon points="${loc}" fill="${color}" stroke="${color}" />
    `);
  }
}

function slash(type, p) {
  return {
    'forward': [
      [p[0], p[1], p[3]],
      [p[1], p[3], p[2]]
    ],
    'back': [
      [p[0], p[1], p[2]],
      [p[0], p[2], p[3]]
    ]
  }[type];
}


function tess(width, height, size, colors) {
  const slashes = ['forward', 'back']
  const grid = [width, height];
  const svg = new SVG(grid[0] * size, grid[1] * size);

  for (let i = 0; i < grid[0]; i++) {
    for (let j = 0; j < grid[1]; j++) {
      const p = [
        [i * size, j * size],
        [(i + 1) * size, j * size],
        [(i + 1) * size, (j + 1) * size],
        [i * size, (j + 1) * size]
      ];

      const t = slash(randomItem(slashes), p);

      svg.addPolygon(t[0], randomItem(colors));
      svg.addPolygon(t[1], randomItem(colors));
    }
  }

  return svg.svg;
}
