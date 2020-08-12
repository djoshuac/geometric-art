window.addEventListener('load', () => {
  const DEFAULT_WIDTH = 16;
  const DEFAULT_HEIGHT = 9;
  const DEFAULT_COLORS = [
    '#002b36', '#073642', '#586e75', '#657b83',
    '#839496', '#93a1a1', '#eee8d5', '#fdf6e3'
  ];
  const DEFAULT_N_COLORS = 10;

  const $contain = document.querySelector('#svg-container');
  const $width = document.querySelector('#width');
  const $height = document.querySelector('#height');
  const $colors = document.querySelector('#colors');
  const $uploadImage = document.querySelector('#upload-image');
  const $nColors = document.querySelector('#n-colors');

  $width.value = DEFAULT_WIDTH;
  $height.value = DEFAULT_HEIGHT;
  DEFAULT_COLORS.forEach(addColor);
  $nColors.value = DEFAULT_N_COLORS;

  let svg;

  compute();
  document.querySelector('#randomize').addEventListener('click', randomize);
  document.querySelector('#download').addEventListener('click', download);
  document.querySelector('#add-color').addEventListener('click', addNewColor);
  document.querySelector('#upload-image').addEventListener('change', useColorsFromImage);
  document.querySelector('#upload-image-button').addEventListener('click', openUploadImage);
  return;

  function compute() {
    svg = tess($width.value, $height.value, getColors());
    $contain.appendChild(svg);
  }

  function randomize() {
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

  function addNewColor() {
    addColor('black');
  }

  function getColors() {
    return [].map.call(
      document.querySelectorAll('.color'),
      (c) => c.value,
    );
  }

  function clearColors() {
    return [].forEach.call(
      document.querySelectorAll('.color'),
      (c) => c.parentElement.removeChild(c),
    );
  }

  async function useColorsFromImage() {
    const file = this.files[0];
    if (file == null) {
      return;
    }

    const n = parseInt($nColors.value);
    const colors = await sampleColorsFromImage(file, n);
    clearColors();
    for (const color of colors) {
      addColor(color);
    }
  }

  function openUploadImage() {
    $uploadImage.click();
  }
});
