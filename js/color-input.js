function createColorInput(color) {
  const $input = htmlToElement(`
    <input class="color">
  `);
  $input.addEventListener('change', (e) => {
    const el = e.target;
    const value = el.value;
    if (value === '') {
      el.parentElement.removeChild(el);
    }
    else {
      setStyle(el, value);
    }
  });
  $input.value = color;
  setStyle($input, color);
  return $input;

  function setStyle($input, color) {
    $input.style.color = color;
    $input.style.border = `1px solid ${color}`;
  }
}
