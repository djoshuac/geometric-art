// https://stackoverflow.com/a/35385518/5818631
function htmlToElement(html) {
  const template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * Math.floor(max)) + min;
}

function randomItem(list) {
  return list[randomInt(0, list.length)];
}

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
      <polygon points="${loc}" style="fill:${fill}" />
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


function tess() {
  // const colors = ['blue', 'yellow', 'green'];
  const colors = ['#002b36', '#073642', '#586e75', '#657b83',
                '#839496', '#93a1a1', '#eee8d5', '#fdf6e3']
  const slashes = ['forward', 'back']
  const grid = [16, 9];
  const size = 100;
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
