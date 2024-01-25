window.addEventListener('load', () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  
  let svg;

  // Menu
  function setupMenu() {
    const active = {};
    function setActive(item) {
      if (active.$submenu != null) {
        active.$menuItem.classList.remove('active');
        active.$submenu.classList.remove('active');
      }

      const $menuItem = $(`#menu-${item}`);
      const $submenu = $(`#submenu-${item}`);
      $menuItem.classList.add('active');
      $submenu.classList.add('active');
      active.$menuItem = $menuItem;
      active.$submenu = $submenu;
    }

    const menuItems = $$('.menu-actions > li')
      .filter(m => m.id != null && m.id.startsWith('menu-'))
      .map(m => m.id.replace('menu-', ''));
    for (const item of menuItems) {
      const $menuItem = $(`#menu-${item}`);
      const $submenu = $(`#submenu-${item}`);
      if ($menuItem == null || $submenu == null) {
        console.error('Could not find menu and/or submenu for', item);
      }
      $menuItem.addEventListener('click', () => setActive(item));
    }
  }
  setupMenu();

  // Toggle
  function setupToggleGroup(groupSelector, activeOption) {
    const chosen = {};
    function setActive($option) {
      if (chosen.$elem != null) {
        chosen.$elem.classList.remove('active');
      }
      $option.classList.add('active');
      chosen.value = $option.value;
      chosen.$elem = $option;
      
      if (svg != null) {
        randomize();
      }
    }

    const $options = $$(groupSelector);
    for (const $option of $options) {
      if ($option.value === activeOption) {
        setActive($option);
      }
      $option.addEventListener('click', () => setActive($option));
    }

    return chosen;
  }

  // Functionality
  const DEFAULT_WIDTH = 16;
  const DEFAULT_HEIGHT = 9;
  const DEFAULT_SIZE = 100;
  const DEFAULT_COLORS = [
    '#002b36', '#073642', '#586e75', '#657b83',
    '#839496', '#93a1a1', '#eee8d5', '#fdf6e3'
  ];
  const DEFAULT_N_COLORS = 10;
  const DEFAULT_FILE_NAME = 'geometric-art.png';

  const $contain = $('#svg-container');
  const $width = $('#width');
  const $height = $('#height');
  const $colors = $('#colors');
  const $uploadImage = $('#upload-image');
  const $nColors = $('#n-colors');
  const $size = $('#size');
  const $fileName = $('#file-name');

  $width.value = DEFAULT_WIDTH;
  $height.value = DEFAULT_HEIGHT;
  $size.value = DEFAULT_SIZE;
  DEFAULT_COLORS.forEach(addColor);
  $nColors.value = DEFAULT_N_COLORS;
  $fileName.value = DEFAULT_FILE_NAME;
  const $pattern = setupToggleGroup('#submenu-patterns > button', 'palette');
  const $colorStrategy = setupToggleGroup('#submenu-color-strategy > button', 'random');

  useScreenDimensions();
  $('#main-menu-randomize').addEventListener('click', randomize);
  $('#download').addEventListener('click', download);
  $('#add-color').addEventListener('click', addNewColor);
  $('#upload-image').addEventListener('change', useColorsFromImage);
  $('#upload-image-button').addEventListener('click', openUploadImage);
  $('#use-screen').addEventListener('click', useScreenDimensions);
  for (const button of $$('.dimWidthByHeight')) {
    const [width, height] = button.innerText.trim().split('x')
    button.addEventListener('click', (e) => {
      $width.value = width
      $height.value = height
    })
  }
  $('#main-menu-full-screen').addEventListener('click', requestFullScreen);
  return;

  function randomize() {
    if (svg != null) {
      $contain.removeChild(svg)
    }
    const width = $width.value;
    const height = $height.value;
    const size = $size.value;
    const pattern = $pattern.value;
    const colors = getColors();
    const colorStrategy = $colorStrategy.value;

    if (pattern === 'normal') {
      svg = tess(width, height, size, colors, colorStrategy);
    } else if(pattern === 'herringbone') {
      svg = herringbone(width, height, size, colors);
    } else if (pattern === 'kites') {
      svg = kites(width, height, size, colors);
    } else if (pattern === 'palette') {
      svg = palette(width, height, size, colors);
    } else {
      console.error('Pattern not implemented', pattern);
    }
    $contain.appendChild(svg);
  }

  async function download() {
    const height = parseInt($height.value) * parseInt($size.value);
    const width = parseInt($width.value) * parseInt($size.value);
    const pngUrl = await svgToPng(svg, height, width);
    downloadUri(pngUrl, $fileName.value);
    URL.revokeObjectURL(pngUrl);
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
      $$('.color'),
      (c) => c.value,
    );
  }

  function clearColors() {
    return [].forEach.call(
      $$('.color'),
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

    randomize();
  }

  function openUploadImage() {
    $uploadImage.click();
  }

  function useScreenDimensions() {
    function gcd(m, n) {
      if (m < n)
        return gcd(n, m);
      else if (n <= 0)
        return m;
      else
        return gcd(n, m % n);
    }

    const height = window.screen.height || document.body.clientHeight;
    const width = window.screen.width || document.body.clientWidth;

    const d = gcd(height, width);
    const h = height / d;
    const w = width / d;

    if (h < 50 && w < 50 && d > 10) {
      $height.value = height / d;
      $width.value = width / d;
      $size.value = d;
    } else if (h > w) {
      const mn = Math.max($height.value, $width.value);
      const mx = Math.min($height.value, $width.value);
      $height.value = mx;
      $width.value = mn;
    } else if (h < w) {
      const mn = Math.max($height.value, $width.value);
      const mx = Math.min($height.value, $width.value);
      $height.value = mn;
      $width.value = mx;
    }

    randomize();
  }

  function requestFullScreen() {
    const element = svg;
    const requestMethod = element.requestFullScreen
      || element.webkitRequestFullScreen
      || element.mozRequestFullScreen
      || element.msRequestFullScreen;

    if (requestMethod) {
      requestMethod.call(element);
    } else {
      console.error('cannot do fullscreen');
    }
  }
});
