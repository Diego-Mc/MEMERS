'use strict'

// ********************************* MEME ************************************

const gElCanvas = document.querySelector('[name=canvas]')
const gCtx = gElCanvas.getContext('2d')

window.addEventListener('load', onInit)

function onInit() {
  renderMeme()

  document
    .querySelector('.meme-download')
    .addEventListener('click', downloadMeme)
}

function renderMeme() {
  const elImg = new Image()
  elImg.onload = () => {
    _setDimensionsByImg(elImg)
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
    renderLines()
  }
  const imgId = getImgId()
  elImg.src = `images/meme-templates/${getImgPath(imgId)}`
  console.log(elImg)
}

function _setDimensionsByImg(img) {
  const { naturalWidth: imgWidth, naturalHeight: imgHeight } = img
  const { clientHeight: cHeight, clientWidth: cWidth } = gElCanvas.parentNode

  const imgRatio = imgWidth / imgHeight

  const cStyle = gElCanvas.parentNode.style

  //check if inside mobile media query - based on that calc either width/height
  const isMobile = window.matchMedia('(max-width: 600px)').matches
  console.log(isMobile, imgHeight, imgWidth, cWidth, cHeight)

  const canvasWidth = parseInt(isMobile ? cWidth : imgRatio * cHeight)
  const canvasHeight = parseInt(isMobile ? imgRatio * cWidth : cHeight)

  //set sizes for all canvas layers
  setCanvasSize(gElCanvas, canvasWidth, canvasHeight)
  setCanvasSize(gElTxtCanvas, canvasWidth, canvasHeight)
  setCanvasSize(gElSelectionCanvas, canvasWidth, canvasHeight)

  if (isMobile) cStyle.height = `${canvasHeight}px`
  else cStyle.width = `${canvasWidth}px`
}

function _clearCanvas() {
  clearCanvas(gElCanvas, gCtx)
}

function downloadMeme() {
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = gElCanvas.width
  tempCanvas.height = gElCanvas.height
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.drawImage(gElCanvas, 0, 0)
  tempCtx.drawImage(gElTxtCanvas, 0, 0)
  const imgSrc = tempCanvas.toDataURL('image/jpeg')
  document.querySelector('.meme-download').href = imgSrc
}

// ****************************** TEXT ************************************
const gElTxtCanvas = document.querySelector('[name=canvas-txt]')
const gTxtCtx = gElTxtCanvas.getContext('2d')

const PLACEHOLDER_TXT = 'Add text here...'
const gPADDING = 20

const LEFT_BOUND = 40 //margin left
const RIGHT_BOUND = 40 //margin right

const gDefaultVals = {
  size: 36,
  font: 'Impact',
  align: 'center',
  color: 'white',
  outline: 'black',
}

window.addEventListener('load', onInitTxt)

function onInitTxt() {
  document.querySelector('.text-add').addEventListener('click', onAddText)
  document
    .querySelector('.text-switch .text-up')
    .addEventListener('click', () => onTextSwitch(+1))
  document
    .querySelector('.text-switch .text-down')
    .addEventListener('click', () => onTextSwitch(-1))

  document.querySelector('.text-line').addEventListener('input', onSetText)

  document.querySelector('.trash').addEventListener('click', onRemoveText)

  document
    .querySelector('.font-decrease')
    .addEventListener('click', () => onSetFontSize(-1))

  document
    .querySelector('.font-increase')
    .addEventListener('click', () => onSetFontSize(+1))

  document
    .querySelector('.text-left')
    .addEventListener('click', () => onAlignTxt('left'))

  document
    .querySelector('.text-center')
    .addEventListener('click', () => onAlignTxt('center'))

  document
    .querySelector('.text-right')
    .addEventListener('click', () => onAlignTxt('right'))

  document.querySelector('#text-fill').addEventListener('input', onFillText)

  document
    .querySelector('#text-outline')
    .addEventListener('input', onOutlineText)
}

function onFillText({ target }) {
  //TODO: use gSelected...(everywhere)
  const { value } = target
  const currLine = getCurrLine()
  if (currLine) currLine.color = value
  else gDefaultVals.color = value
  updateTxtCanvas()
}

function onOutlineText({ target }) {
  //TODO: use gSelected...(everywhere)
  const { value } = target
  const currLine = getCurrLine()
  if (currLine) currLine.outline = value
  else gDefaultVals.outline = value
  updateTxtCanvas()
}

function onRemoveText() {
  removeText()
  renderLines()
  const newLine = getCurrLine()
  if (newLine) onTextSelect(newLine)
  else _clearSelectionCanvas()
}

function onAddText() {
  const len = getLines().length
  let { size, font, align, color, outline } = getCurrLine() || gDefaultVals
  let txt = PLACEHOLDER_TXT
  let x = LEFT_BOUND
  let y =
    len === 0 ? 50 : len === 1 ? gElCanvas.height - 50 : gElCanvas.height / 2
  let width = gElTxtCanvas.clientWidth - x - x
  let height = calcLineHeight(gTxtCtx, txt, { size, font })

  addText(x, y, width, size, size, font, align, color, outline)
  renderLines()
  onTextSelect(getCurrLine())
}

//TODO: change txt for text
function onAlignTxt(alignStr) {
  //TODO: add radio behaviour with css .selected
  alignText(alignStr)
  gDefaultVals.align = alignStr
  updateTxtCanvas()
}

function onSetFontSize(diff) {
  const elSizeInput = document.querySelector('.text-size input')
  const value = +elSizeInput.value.match(/\d+(?=px)/)[0]
  elSizeInput.value = value + diff + 'px'
  setFontSize(diff)

  renderLines()
  //update height ... (also in multi-line)
  updateSelectionCanvas()
}

function onTextSwitch(dir) {
  const newLine = textSwitch(dir)

  if (!newLine) return

  _updateTextInput(newLine)
  onTextSelect(newLine)

  document.querySelector('.text-size input').value = newLine.size + 'px'
}

function renderLine(line) {
  let { txt, size, font, align, color, outline } = line
  gTxtCtx.font = `${size}px ${font}`
  gTxtCtx.fillStyle = color
  gTxtCtx.strokeStyle = outline
  gTxtCtx.lineWidth = 2
  txt = txt || PLACEHOLDER_TXT
  gTxtCtx.textBaseline = 'middle'
  gTxtCtx.textAlign = align

  printWordWrap(txt, line)
}

function renderLines() {
  const memeData = getMemeData()
  const { lines } = memeData
  console.log('HEY', lines)

  _clearTxtCanvas()
  lines.forEach(renderLine)
  const currLine = getCurrLine()
  _updateTextInput(currLine)
}

function printWordWrap(txt, line) {
  let lineHeight = calcLineHeight(gTxtCtx, txt, line)

  let { x, y, width, align } = line

  if (width <= 0) return

  //get words separated by space, check 1st word, if smaller than maxWidth
  //check the next word...
  //if found a word that is lengthier than maxWidth it means that all words
  //from previous weren't, so idx-- and splice them out to print a full line
  //within the width boundary. afterwards currLine++ and repeat.

  let words = txt.split(' ')
  let currLine = 0
  let idx = 1
  while (words.length > 0 && idx <= words.length) {
    let str = words.slice(0, idx).join(' ')
    let w = gTxtCtx.measureText(str).width
    if (w > width) {
      if (idx === 1) idx++

      gTxtCtx.fillText(
        words.slice(0, idx - 1).join(' '),
        alignX(align, x, width),
        y + lineHeight * currLine
      )
      gTxtCtx.strokeText(
        words.slice(0, idx - 1).join(' '),
        alignX(align, x, width),
        y + lineHeight * currLine
      )
      currLine++

      words = words.splice(idx - 1)
      idx = 1
    } else idx++
  }
  if (idx > 0) {
    gTxtCtx.fillText(
      words.slice(0, idx - 1).join(' '),
      alignX(align, x, width),
      y + lineHeight * currLine
    )
    gTxtCtx.strokeText(
      words.slice(0, idx - 1).join(' '),
      alignX(align, x, width),
      y + lineHeight * currLine
    )
  }
  line.height = lineHeight * (currLine + 1)
  // TODO: make each line go up/down on render to make text middle aligned
}

function onSetText({ target: elTextInput }) {
  if (!getCurrLine()) onAddText()
  setText(elTextInput.value)
  updateTxtCanvas()
}

function updateTxtCanvas() {
  _clearTxtCanvas()
  renderLines()
}

function _updateTextInput(line) {
  const txt = line ? line.txt : ''
  const elTextInput = document.querySelector('.text-line')

  elTextInput.value = txt
  if (txt === '') elTextInput.placeholder = PLACEHOLDER_TXT
}

function alignX(align, x, width = gElTxtCanvas.width) {
  switch (align) {
    case 'center':
      return x + width / 2
    case 'left':
      return x + gPADDING
    case 'right':
      return x + width - gPADDING
  }
}

function _clearTxtCanvas() {
  clearCanvas(gElTxtCanvas, gTxtCtx)
}

// ****************************** SELECTION *********************************

const gElSelectionCanvas = document.querySelector('[name=canvas-selection]')
const gSelectionCtx = gElSelectionCanvas.getContext('2d')

let gCurrSelection = {
  line: {},
  box: Path2D,
  resize: Path2D,
  isDrag: false,
  isResize: false,
}

function onTextSelect(line) {
  let { txt, x, y, width, height } = line
  _clearSelectionCanvas()
  txt = txt || PLACEHOLDER_TXT
  const boundingBox = new Path2D()
  const lineHeight = calcLineHeight(gTxtCtx, txt, line)
  boundingBox.rect(x, y - lineHeight / 2, width, height)
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

  gElSelectionCanvas.addEventListener('mousemove', onMouseMove)
  gElSelectionCanvas.addEventListener('mousedown', onMouseDown)
  gElSelectionCanvas.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(ev) {
  if (gCurrSelection.isDrag) {
    const { clientX, clientY } = ev
    const { x, y } = gCurrSelection.select

    const [dx, dy] = [clientX - x, clientY - y]

    gCurrSelection.line.x += dx
    gCurrSelection.line.y += dy

    renderLines()
    updateSelectionCanvas()

    gCurrSelection.select = { x: clientX, y: clientY }
  } else if (gCurrSelection.isResize) {
    const { clientX } = ev
    const { x } = gCurrSelection.select

    const dx = clientX - x

    // gCurrSelection.line.x += dx
    const { line } = gCurrSelection
    line.x -= dx
    line.width += dx * 2

    renderLines()
    updateSelectionCanvas()

    gCurrSelection.select.x = clientX
  } else {
    const isPointInStroke = gSelectionCtx.isPointInStroke(
      gCurrSelection.box,
      ev.offsetX,
      ev.offsetY
    )
    if (isPointInStroke) {
      gElSelectionCanvas.style.cursor = 'grab'
    }

    const isPointInPath = gSelectionCtx.isPointInPath(
      gCurrSelection.resize,
      ev.offsetX,
      ev.offsetY
    )
    if (isPointInPath) {
      gElSelectionCanvas.style.cursor = 'col-resize'
    }

    if (!isPointInPath && !isPointInStroke) {
      gElSelectionCanvas.style.cursor = 'auto'
    }
  }
}

function onMouseDown(ev) {
  const { clientX, clientY } = ev
  gCurrSelection.select = { x: clientX, y: clientY }

  const isPointInPath = gSelectionCtx.isPointInPath(
    gCurrSelection.resize,
    ev.offsetX,
    ev.offsetY
  )
  if (isPointInPath) {
    gElSelectionCanvas.style.cursor = 'col-resize'
    gCurrSelection.isResize = true
  } else {
    const isPointInStroke = gSelectionCtx.isPointInStroke(
      gCurrSelection.box,
      ev.offsetX,
      ev.offsetY
    )
    if (isPointInStroke) {
      gCurrSelection.isDrag = true
      gElSelectionCanvas.style.cursor = 'grabbing'
    }
  }

  // if (!isPointInPath && !isPointInStroke) {
  //   gElSelectionCanvas.style.cursor = 'auto'
  // }
}

function onMouseUp(ev) {
  gCurrSelection.isDrag = false
  gCurrSelection.isResize = false
  gCurrSelection.select = null
}

function _clearSelectionCanvas() {
  clearCanvas(gElSelectionCanvas, gSelectionCtx)
}

function updateSelectionCanvas() {
  _clearSelectionCanvas()
  onTextSelect(gCurrSelection.line)
}
