function downloadUri(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
}

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


function sum(sequence) {
  let s = 0;
  for (let item of sequence) {
    s += item;
  }
  return s;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function hex3ToRgb(hex) {
  var result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
