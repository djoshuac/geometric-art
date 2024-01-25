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
      [p[1], p[3], p[2]],
    ],
    'back': [
      [p[0], p[2], p[3]],
      [p[0], p[1], p[2]],
    ]
  }[type];
}


function tess(width, height, size, colors, colorStrategy) {
  const svg = new SVG(width * size, height * size);
  const slashes = ['forward', 'back']

  // create nodes
  const nodes = []
  for (let i = 0; i < height; i++) {
    const row = []
    for (let j = 0; j < width; j++) {
      const slash = randomItem(slashes) // determine if square is forward slash or backward slash
      if (colorStrategy === 'random') {
        const square = [
          new GraphNode({ slash: slash, color: randomItem(colors) }),
          new GraphNode({ slash: slash, color: randomItem(colors) }),
        ]
        row.push(square)
      } else {
        row.push([
          new GraphNode({ slash: slash }),
          new GraphNode({ slash: slash }),
        ])
      }
    }
    nodes.push(row)
  }

  // handle n-coloring of graph
  if (colorStrategy === 'k-color') {
    // initialize neighbors
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const [top, bottom] = inBoundsIndex(nodes, i, j)
        const north = inBoundsIndex(nodes, i-1, j, 1) // bottom of square above
        const south = inBoundsIndex(nodes, i+1, j, 0) // top of square below

        // need to check slash for east and west
        const eastTop = inBoundsIndex(nodes, i, j+1, 0)
        const eastBottom = inBoundsIndex(nodes, i, j+1, 1)
        const westTop = inBoundsIndex(nodes, i, j-1, 0)
        const westBottom = inBoundsIndex(nodes, i, j-1, 1)
        const east = eastTop?.data?.slash === 'forward' ? eastTop : eastBottom // top if forward
        const west = westTop?.data?.slash === 'forward' ? westBottom : westTop // bottom if forward

        top.neighbors.push(bottom)
        bottom.neighbors.push(top)

        if (top.data.slash === 'forward') {
          top.neighbors.push(...[north, west].filter(n => n != null))
          bottom.neighbors.push(...[east, south].filter(n => n != null))
        } else {
          top.neighbors.push(...[north, east].filter(n => n != null))
          bottom.neighbors.push(...[west, south].filter(n => n != null))
        }
      }
    }

    const graph = new Graph(nodes)
    graph.colorNodes(colors)
  }

  // create the svg
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const p = [
        [j * size, i * size],
        [j * size, (i + 1) * size,],
        [(j + 1) * size, (i + 1) * size],
        [(j + 1) * size, i * size]
      ];

      const t = slash(nodes[i][j][0].data.slash, p);
      svg.addPolygon(t[0], nodes[i][j][0].data.color);
      svg.addPolygon(t[1], nodes[i][j][1].data.color);
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
    const colorTypes = [
      /^#[a-f\d]{6}$/i, // e.g. #000000
      /^#[a-f\d]{3}$/i, // e.g. #000
    ]

    const color1Type = colorTypes.findIndex((reg) => reg.test(color1))
    const color2Type = colorTypes.findIndex((reg) => reg.test(color2))

    if (color1Type !== color2Type) {
      return color1Type - color2Type
    }

    // Case: #000000
    if (color1Type == 0) {
      const rgb1 = Object.values(hexToRgb(color1));
      const rgb2 = Object.values(hexToRgb(color2));
      return sum(rgb1.map(Math.sqrt)) - sum(rgb2.map(Math.sqrt))
    }

    // Case: #000
    if (color1Type == 1) {
      const rgb1 = Object.values(hex3ToRgb(color1));
      const rgb2 = Object.values(hex3ToRgb(color2));
      return sum(rgb1.map(Math.sqrt)) - sum(rgb2.map(Math.sqrt))
    }

    // Case: lexicographical order
    if (color1 < color2) return -1
    if (color1 > color2) return 1
    return 0
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
