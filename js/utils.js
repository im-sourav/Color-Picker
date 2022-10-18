"use strict"

class Canvas {
  constructor(appendElement, width, height) {
    this.appendElement = appendElement;
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    this.appendElement.appendChild(this.canvas);
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.context = this.canvas.getContext("2d");
  }
  fillStyle = color => this.context.fillStyle = color;
  lineTo = (x, y) => this.context.lineTo(x, y);
  clearRect = () => this.context.clearRect(0, 0, this.width, this.height);
  fillRect = (x, y, w, h) => this.context.fillRect(x, y, w, h);
  scale = (x, y) => this.context.scale(x, y);

  createRadialGradient = (x1, y1, r1, x2, y2, r2) =>
    this.context.createRadialGradient(x1, y1, r1, x2, y2, r2);
  createLinearGradient = (x1, y1, x2, y2) =>
    this.context.createLinearGradient(x1, y1, x2, y2);

  arc = (x, y, radius, startAngle, endAngle, anti) => {
    this.context.beginPath();
    this.context.arc(x, y, radius, startAngle, endAngle, anti);
    this.context.closePath();
  }
  moveTo = (x, y) => {
    this.context.beginPath();
    this.context.moveTo(x, y);
  };
  stroke = (strokeWidth) => {
    this.context.lineWidth = strokeWidth;
    this.context.stroke();
    this.context.closePath();
  }
  fill = () => {
    this.context.fill();
    this.context.closePath();
  };

  // for image 
  getImageData = (sx, sy, sw, sh) => this.context.getImageData(sx, sy, sw, sh);
  putImageData = (image, dx, dy) => this.context.putImageData(image, dx, dy);
}


/* ---------- math ---------- */
const PI = Math.PI;
const sin = x => Math.sin(x);
const cos = y => Math.cos(y);
const atan2 = (y, x) => Math.atan2(y, x);
const abs = n => Math.abs(n);
const round = n => Math.round(n);

const toRadian = degree => (degree * Math.PI) / 180;// degree convert to radian
const toDegree = radian => (radian * 180) / Math.PI;// radian convert to Degree

const random = (start = 0, end = 1, int_floor = false) => {
  const result = start + (Math.random() * (end - start));
  return int_floor ? Math.floor(result) : result;
}

/* e.x 
(0 start) -------.------ (10 end) input . = 5
(10 min) ----------------.---------------- (30 max) output . = 20
*/
const map = (point, start, end, min, max) => {
  const per = (point - start) / (end - start);
  return ((max - min) * per) + min;
}


let isMobile = localStorage.mobile || window.navigator.maxTouchPoints > 1;

// isMobile = true;

/* ------------- hsl ------------ */
const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
    : 0;

  return {
    h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
    s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    l: (100 * (2 * l - s)) / 2,
  };
};
const hlsToRgb = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: 255 * f(0), g: 255 * f(8), b: 255 * f(4) };
};

/* ------------- cmyk ------------ */
function cmykToRgb(c, m, y, k) {
  c /= 100; m /= 100; y /= 100; k /= 100;
  c *= (1 - k) + k; m *= (1 - k) + k; y *= (1 - k) + k;
  return {
    r: Math.round(255 * (1 - c)),
    g: Math.round(255 * (1 - m)),
    b: Math.round(255 * (1 - y))
  }
}
function rgbToCmyk(r, g, b) {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, Math.min(m, y));

  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);

  c = Math.round(c * 10000 / 100);
  m = Math.round(m * 10000 / 100);
  y = Math.round(y * 10000 / 100);
  k = Math.round(k * 10000 / 100);

  return {
    c: isNaN(c) ? 0 : c,
    m: isNaN(m) ? 0 : m,
    y: isNaN(y) ? 0 : y,
    k: isNaN(k) ? 0 : k
  }
}
/* ------------- hwb ------------ */
function rgbToHwb(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let f, i,
    w = Math.min(r, g, b),
    v = Math.max(r, g, b),
    black = 1 - v;

  if (v === w) return { h: 0, w: w * 100, b: black * 100 };
  f = r === w ? g - b : (g === w ? b - r : r - g);
  i = r === w ? 3 : (g === w ? 5 : 1);

  return { h: ((i - f / (v - w)) / 6) * 100, w: w * 100, b: black * 100 };
}
function hwbToRgb(h, w, b) {
  h *= 6;

  let v = 1 - b, n, f, i;
  if (!h) return { r: v, g: v, b: v };
  i = h | 0;
  f = h - i;
  if (i & 1) f = 1 - f;
  n = w + f * (v - w);
  v = (v * 255) | 0;
  n = (n * 255) | 0;
  w = (w * 255) | 0;

  switch (i) {
    case 6:
    case 0: return { r: v, g: n, b: w };
    case 1: return { r: n, g: v, b: w };
    case 2: return { r: w, g: v, b: n };
    case 3: return { r: w, g: n, b: v };
    case 4: return { r: n, g: w, b: v };
    case 5: return { r: v, g: w, b: n };
  }
}


/* ------------- hsv ------------ */
function rgbToHsv(r, g, b) {
  if (arguments.length === 1) {
    g = r.g, b = r.b, r = r.r;
  }
  var max = Math.max(r, g, b), min = Math.min(r, g, b),
    d = max - min,
    h,
    s = (max === 0 ? 0 : d / max),
    v = max / 255;

  switch (max) {
    case min: h = 0; break;
    case r: h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d; break;
    case g: h = (b - r) + d * 2; h /= 6 * d; break;
    case b: h = (r - g) + d * 4; h /= 6 * d; break;
  }

  return {
    h: h * 100,
    s: s * 100,
    v: v * 100
  };
}
function hsvToRgb(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Returns the selected html element.
 * @param {string} id html element id.
 */
const ID = (id) => document.getElementById(id);



function getRGB(str) {
  return str.split(",").join("").split("rgb(").join("")
    .split(")").join("").split(" ").map(e => parseInt(e));
}

const rgbToHex = (r, g, b) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
