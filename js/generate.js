class SVG {
  constructor(width, height, crispEdges=true) {
    const crisp = crispEdges ? 'shape-rendering="crispEdges"' : '';
    this.svg = htmlToElement(`
      <svg
        width=${width}
        height=${height}
        ${crisp}
      ></svg>
    `);
  }

  addPolygon(points, fill, rotate=null) {
    const color = fill || 'black';
    const loc = points.map(p => p.join(',')).join(' ');
    const rot = rotate == null ? '' : `transform="rotate(${rotate.map(x => x.toString()).join(', ')})"`;

    this.svg.insertAdjacentHTML('beforeend', `
      <polygon points="${loc}" fill="${color}" ${rot}/>
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

function kites(width, height, size, colors) {
  const svg = new SVG(width * size, height * size, false);

  const density = 2;
  const h = size / 4;
  const w = size / 3;

  const shape = [
    [w*0.1, h*1],
    [w*1, h*3],
    [w*1.9, h*1],
    [w*1, h*0],
  ];

  for (let i = 0; i < height * density; i++) {
    const y0 = size * i / density;
    for (let j = 0; j < width * density; j++) {
      const x0 = size * j / density;
      svg.addPolygon(
        shape.map(([x, y]) => [x + x0, y + y0]),
        randomItem(colors),
        [randomInt(0, 360), x0, y0]
      );
    }
  }

  return svg.svg;
}

function palette(width, height, size, colors) {
  const svg = new SVG(width * size, height * size);

  const n = colors.length;
  const w = width * size / n;

  // sort colors
  colors.sort((color1, color2) => {
    const rgb1 = Object.values(hexToRgb(color1));
    const rgb2 = Object.values(hexToRgb(color2));
    return sum(rgb1.map(Math.sqrt)) - sum(rgb2.map(Math.sqrt))
  });

  for (let i = 0; i < colors.length; i++) {
    const x = i * w
    svg.addPolygon([
      [x, 0],
      [x, height * size],
      [x + w, height * size],
      [x + w, 0],
    ], colors[i]);
  }

  return svg.svg;
}
