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
  const svg = new SVG(width * size, height * size);
  const slashes = ['forward', 'back']

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
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


function herringbone(width, height, size, colors) {
  const svg = new SVG(width * size, height * size);

  const density = 4;
  const s = size / density;


  for (let i = -2; i < width * density; i += 4) {
    for (let j = -2; j < height * density; j += 2) {
      const t1 = [
        [(i + 0) * s, (j + 0) * s],
        [(i + 2) * s, (j - 2) * s],
        [(i + 3) * s, (j - 1) * s],
        [(i + 1) * s, (j + 1) * s],
      ];
      const t2 = [
        [(i + 2) * s, (j + 0) * s],
        [(i + 3) * s, (j - 1) * s],
        [(i + 5) * s, (j + 1) * s],
        [(i + 4) * s, (j + 2) * s],
      ];
      svg.addPolygon(t1, randomItem(colors));
      svg.addPolygon(t2, randomItem(colors));
    }
  }

  return svg.svg;
}
