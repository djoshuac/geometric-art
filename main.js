window.addEventListener('load', () => {
  const DEFAULT_WIDTH = 16;
  const DEFAULT_HEIGHT = 9;

  const $contain = document.querySelector('#svg-container');
  const $width = document.querySelector('#width');
  const $height = document.querySelector('#height');
  $width.value = DEFAULT_WIDTH;
  $height.value = DEFAULT_HEIGHT;

  let svg;

  compute();
  document.querySelector('#recompute').addEventListener('click', recompute);
  document.querySelector('#download').addEventListener('click', download);
  return;

  function compute() {
    svg = tess($width.value, $height.value);
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
});
