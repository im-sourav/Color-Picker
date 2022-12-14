// create hsl 0 to 360 deg all color 
function get360Image(ctx, size) {
  const r = size / 2; // radius
  const stape = toRadian(1.4)

  for (let i = 0; i < 360; i++) {
    const angle = toRadian(i);
    ctx.fillStyle(`hsl(${i}, 100%, 50%)`);
    ctx.moveTo(r, r);
    ctx.lineTo(r + r * sin(angle), r + r * cos(angle));
    ctx.lineTo(r + r * sin(angle + stape), r + r * cos(angle + stape));
    ctx.fill();
  }
  return ctx.getImageData(0, 0, size, size);
}

function getImageLocationColor(imgData, y, x, size) {
  const i = (round(y) * size + round(x)) * 4;
  return { r: imgData[i], g: imgData[i + 1], b: imgData[i + 2] };
}

/**
 * @param {Object} c normal color
 * @param {Object} tc terget color
 * @param {Number} extra extra
 */
function isCloseToColor(c, tc, extra) {
  return (
    (tc.r >= c.r - extra && tc.r <= c.r + extra) && tc.g == c.g && tc.b == c.b) ||
    (tc.r == c.r && (tc.g >= c.g - extra && tc.g <= c.g + extra) && tc.b == c.b) ||
    (tc.r == c.r && tc.g == c.g && (tc.b >= c.b - extra && tc.b <= c.b + extra)
  );
}

function copyText(str, ele, ele1) {
  const inp = document.createElement("input");
  document.body.appendChild(inp);
  inp.type = "text";
  inp.value = str;
  inp.select();
  inp.setSelectionRange(0, 30); 
  navigator.clipboard.writeText(str);
  document.body.removeChild(inp);
  

  ele.focus();
  ele.select();

  ele1.classList.add("hover");

  setTimeout(() => {
    ele1.classList.remove("hover");
    ele.blur();
  }, 2000);
}
