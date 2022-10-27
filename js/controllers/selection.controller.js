'use strict'

const gElSelectionCanvas = document.querySelector('[name=canvas-selection]')
const gSelectionCtx = gElSelectionCanvas.getContext('2d')

let gCurrSelection = {
  line: {},
  box: Path2D,
  resize: Path2D,
}

function onTextSelect(line) {
  let { txt, x, y, width, height } = line
  _clearSelectionCanvas()
  txt = txt || PLACEHOLDER_TXT
  const boundingBox = new Path2D()
  boundingBox.rect(x, y - height / 2, width, height)
  gSelectionCtx.lineWidth = 4
  gSelectionCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  gSelectionCtx.setLineDash([4, 8])
  gSelectionCtx.lineCap = 'round'
  gSelectionCtx.stroke(boundingBox)
  gSelectionCtx.strokeStyle = 'rgba(255, 255, 255, 0)'
  gSelectionCtx.setLineDash([])
  gSelectionCtx.lineWidth = 8
  gSelectionCtx.stroke(boundingBox)

  const resizeIcon = new Path2D()
  resizeIcon.arc(x + width, y, 6, 0, 2 * Math.PI)
  gSelectionCtx.fillStyle = 'red'
  gSelectionCtx.fill(resizeIcon)

  gCurrSelection.box = boundingBox
  gCurrSelection.resize = resizeIcon
  gCurrSelection.line = getCurrLine()

  gElSelectionCanvas.addEventListener('mousemove', (event) => {
    const isPointInStroke = gSelectionCtx.isPointInStroke(
      boundingBox,
      event.offsetX,
      event.offsetY
    )
    if (isPointInStroke) gElSelectionCanvas.style.cursor = 'grab'

    const isPointInPath = gSelectionCtx.isPointInPath(
      resizeIcon,
      event.offsetX,
      event.offsetY
    )
    if (isPointInPath) gElSelectionCanvas.style.cursor = 'col-resize'

    if (!isPointInPath && !isPointInStroke)
      gElSelectionCanvas.style.cursor = 'auto'
  })
}

function _clearSelectionCanvas() {
  clearCanvas(gElSelectionCanvas, gSelectionCtx)
}
