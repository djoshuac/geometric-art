window.addEventListener('load', () => {
  const DEFAULT_WIDTH = 16;
  const DEFAULT_HEIGHT = 9;
  const DEFAULT_COLORS = [
    '#002b36', '#073642', '#586e75', '#657b83',
    '#839496', '#93a1a1', '#eee8d5', '#fdf6e3'
  ];

  const $contain = document.querySelector('#svg-container');
  const $width = document.querySelector('#width');
  const $height = document.querySelector('#height');
  const $colors = document.querySelector('#colors');

  $width.value = DEFAULT_WIDTH;
  $height.value = DEFAULT_HEIGHT;
  DEFAULT_COLORS.forEach(addColor);

  let svg;

  compute();
  document.querySelector('#recompute').addEventListener('click', recompute);
  document.querySelector('#download').addEventListener('click', download);
  return;

  function compute() {
    svg = tess($width.value, $height.value, getColors());
    $contain.appendChild(svg);
  }

  function recompute() {
    $contain.removeChild(svg)
    compute();
  }

  function download() {
    const svgString = $contain.innerHTML;
    const blob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8'
    });
    const blobUrl = URL.createObjectURL(blob);
    downloadUri(blobUrl, 'geometric.svg');
    URL.revokeObjectURL(blobUrl);
  }

  function addColor(color) {
    const $input = createColorInput(color);
    $colors.appendChild($input);
  }

  function getColors() {
    return [].map.call(
      document.querySelectorAll('.color'),
      (c) => c.value
    );
  }
});
