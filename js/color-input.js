function createColorInput(color) {
  const $input = htmlToElement(`
    <input class="color">
  `);
  $input.addEventListener('change', (e) => {
    setStyle(e.target, e.target.value);
  });
  $input.value = color;
  setStyle($input, color);
  return $input;

  function setStyle($input, color) {
    $input.style.color = color;
    $input.style.border = `1px solid ${color}`;
  }
}
