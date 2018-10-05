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
