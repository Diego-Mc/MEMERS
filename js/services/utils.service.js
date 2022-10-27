'use strict'

function clearCanvas(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
}

function setCanvasSize(canvas, width, height) {
  canvas.width = width
  canvas.height = height
}

function calcLineHeight(ctx, txt, { size, font }) {
  ctx.font = `${size}px ${font}`

  const {
    actualBoundingBoxAscent: topHeight,
    actualBoundingBoxDescent: bottomHeight,
  } = gTxtCtx.measureText(txt)
  return topHeight + bottomHeight
}
