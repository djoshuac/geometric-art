/**
 * Find `n` distinct colors in image using k-means clustering
 */
async function sampleColorsFromImage(file, n) {
    const image = await getImageData(file);
    const pixels = lloyds(image, n);
    return pixels.map(pixelToColor);
}


function componentToHex(c) {
    const hex = Math.floor(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function pixelToColor(pixel) {
    return rgbToHex(...pixel);
}

function getImageData(file) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.height = image.height;
            canvas.width = image.width;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            URL.revokeObjectURL(image.src);
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
            resolve(data);
        };
        image.onerror = reject;
    });
}

function lloyds(image, n) {
    const pixels = [];
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            pixels.push(get(image, x, y));
        }
    }
    const bound = boundingBox(pixels);

    const threshold = n * 6;
    let centroids = Array(n).fill(0).map(() => randomPixel(bound));
    let change = Infinity;
    const groups = centroids.map((centroid, index) => ({
        index,
        centroid,
        pixels: [],
    }));

    while (change > threshold) {
        // assign pixels to the nearest centroid
        for (const pixel of pixels) {
            const g = closestTo(pixel, centroids);
            groups[g].pixels.push(pixel);
        }

        // pick new centroids for each group
        let oldCentroids = centroids;
        centroids = [];
        for (const group of groups) {
            group.centroid = average(group.pixels) ?? randomPixel(bound);
            centroids.push(group.centroid);
            group.pixels = []; // clear the groups for the next iteration
        }
        
        // compute change
        change = 0;
        for (let i = 0; i < oldCentroids.length; i++) {
            change += distance(centroids[i], oldCentroids[i]);
        }
    }

    return centroids;
}

function boundingBox(pixels) {
    const r = [255, 0];
    const g = [255, 0];
    const b = [255, 0];

    for (const pixel of pixels) {
        r[0] = Math.min(r[0], pixel[0]);
        g[0] = Math.min(g[0], pixel[1]);
        b[0] = Math.min(b[0], pixel[2]);
        r[1] = Math.max(r[1], pixel[0]);
        g[1] = Math.max(g[1], pixel[1]);
        b[1] = Math.max(b[1], pixel[2]);
    }

    return [r, g, b]
}

function randInt(low, high) {
    return Math.floor(Math.random() * (high - low)) + low;
}

function randomPixel(bound) {
    return [
        randInt(bound[0][0], bound[0][1]),
        randInt(bound[1][0], bound[1][1]),
        randInt(bound[2][0], bound[2][1]),
    ];
}

/** get pixel data at column x and row y */
function get(image, x, y) {
    const index = y * image.width * 4 + x * 4;
    return [
        image.data[index + 0], // r
        image.data[index + 1], // g
        image.data[index + 2], // b
    ];
}

function closestTo(p, centroids)  {
    let closest = [-1, Infinity];
    for (let i = 0; i < centroids.length; i++) {
        const d = distance(p, centroids[i]);
        if (d < closest[1]) {
            closest = [i, d]
        }
    }
    return closest[0];
}

/**
 * L1 distance bewteen two pixels
 */
function distance(c1, c2) {
    return 0 +
        Math.abs(c1[0] - c2[0]) +
        Math.abs(c1[1] - c2[1]) +
        Math.abs(c1[2] - c2[2]);
}

/**
 * Find the centroid of a group of pixels
 */
function average(pixels) {
    let r = 0;
    let g = 0;
    let b = 0;
    const size = pixels.length;

    if (size === 0) {
        return null;
    }

    for (const p of pixels) {
        r += p[0];
        g += p[1];
        b += p[2];
    }

    return [
        r / size,
        g / size,
        b / size,
    ];
}

function svgToPng(svg, height, width) {
    return new Promise((resolve, reject) => {
        const xml = new XMLSerializer().serializeToString(svg);

        const canvas = document.createElement('canvas');
        canvas.height = height;
        canvas.width = width;
        
        const svg64 = btoa(xml);
        const b64Start = 'data:image/svg+xml;base64,';
        const image64 = b64Start + svg64;

        const image = new Image();
        image.src = image64;
        image.onload = () => {
            canvas.getContext('2d').drawImage(image, 0, 0);
            resolve(canvas.toDataURL());
        };
        image.onerror = reject;
    });
}
