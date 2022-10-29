'use strict'

function clearCanvas(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
}

function setCanvasSize(canvas, width, height) {
  canvas.width = width
  canvas.height = height
}

function setElementSize(el, width, height) {
  el.style.width = `${width}px`
  el.style.height = `${height}px`
}

function calcLineHeight(ctx, txt, { size, font }) {
  ctx.font = `${size}px ${font}`

  const {
    actualBoundingBoxAscent: topHeight,
    actualBoundingBoxDescent: bottomHeight,
  } = gCtxs.text.measureText(txt)
  return topHeight + bottomHeight
}

function addEventHandler(type) {
  return (queryOrDomEl, cb) => {
    if (typeof queryOrDomEl === 'string') {
      document.querySelector(queryOrDomEl).addEventListener(type, cb)
    } else queryOrDomEl.addEventListener(type, cb)
  }
}

function printText(ctx, text, x, y) {
  ctx.fillText(text, x, y)
  ctx.strokeText(text, x, y)
}

function setCtxPrefs(ctx, options) {
  const {
    size,
    font,
    align,
    color,
    outline,
    lineWidth,
    baseline,
    lineDash,
    lineCap,
  } = options
  if (size) ctx.font = ctx.font.replace(/\d+(?=px)/, size)
  if (font) ctx.font = `${ctx.font.split(' ')[0]} ${font}`
  if (align) ctx.textAlign = align
  if (color) ctx.fillStyle = color
  if (outline) ctx.strokeStyle = outline
  if (lineWidth) ctx.lineWidth = lineWidth
  if (baseline) ctx.textBaseline = baseline
  if (lineDash) ctx.setLineDash(lineDash)
  if (lineCap) ctx.lineCap = lineCap
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function addShareListener(elTarget, data) {
  //from MDN
  // const shareData = { title, text, url }

  // Share must be triggered by "user activation"
  elTarget.addEventListener('click', async () => {
    try {
      await navigator.share(data)
    } catch (err) {
      console.log('unable to share :(')
    }
  })
}
