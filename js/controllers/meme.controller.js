'use strict'

const gElCanvases = {
  meme: document.querySelector('[name=canvas]'),
  text: document.querySelector('[name=canvas-txt]'),
  selection: document.querySelector('[name=canvas-selection]'),
}

const gCtxs = {
  meme: gElCanvases.meme.getContext('2d'),
  text: gElCanvases.text.getContext('2d'),
  selection: gElCanvases.selection.getContext('2d'),
}

window.addEventListener('load', onInit)

// ********************************* MEME ************************************

function onInit() {
  renderMeme()

  _addEventListeners()

  setCtxPrefs(gCtxs.text, { lineWidth: 2, textBaseline: 'middle' })
}

function _addEventListeners() {
  // HANDLERS (util):
  const onInput = addEventHandler('input')
  const onClick = addEventHandler('click')

  // TOOLS:
  onClick('.text-add', onAddText)
  onClick('.text-switch .text-up', () => onSelectedLineChange(+1))
  onClick('.text-switch .text-down', () => onSelectedLineChange(-1))
  onInput('.text-line', onSetText)
  onClick('.trash', onRemoveLine)
  onClick('.dropdown-item[name=impact]', () => onSetFont('Impact'))
  onClick('.dropdown-item[name="secular one"]', () => onSetFont('Secular One'))
  onClick('.dropdown-item[name=rubik]', () => onSetFont('Rubik'))
  onClick('.dropdown-item[name=montserrat]', () => onSetFont('Montserrat'))
  onClick('.font-decrease', () => onSetFontSize(-1))
  onClick('.font-increase', () => onSetFontSize(+1))
  onClick('.text-left', () => onAlignText('left'))
  onClick('.text-center', () => onAlignText('center'))
  onClick('.text-right', () => onAlignText('right'))
  onInput('#text-fill', onFillText)
  onInput('#text-outline', onOutlineText)

  // SOCIAL:
  onClick('.meme-download', downloadMeme)
}

function renderMeme() {
  const canvases = Object.values(gElCanvases)
  const canvasContainer = canvases[0].parentNode
  const elImg = new Image()

  elImg.onload = () => {
    const { naturalWidth: imgWidth, naturalHeight: imgHeight } = elImg
    const { width, height } = _getAspectCanvasSize(imgWidth / imgHeight)

    canvases.forEach((canvas) => setCanvasSize(canvas, width, height))
    setElementSize(canvasContainer, width, height)
    gCtxs.meme.drawImage(elImg, 0, 0, width, height)
    updateTextLines()
  }

  const imgId = getImgId()
  elImg.src = `images/meme-templates/${getImgPath(imgId)}`
}

function _getAspectCanvasSize(ratio) {
  const canvasContainer = gElCanvases.meme.parentNode

  const { clientHeight: cHeight, clientWidth: cWidth } = canvasContainer

  const isWide = window.getComputedStyle(canvasContainer).width === '100%'
  const width = parseInt(isWide ? cWidth : ratio * cHeight)
  const height = parseInt(isWide ? ratio * cWidth : cHeight)

  return { width, height }
}

function _clearMemeCanvas() {
  clearCanvas(gElCanvases.meme, gCtxs.meme)
}

function downloadMeme() {
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = gElCanvases.meme.width
  tempCanvas.height = gElCanvases.meme.height
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.drawImage(gElCanvases.meme, 0, 0)
  tempCtx.drawImage(gElCanvases.text, 0, 0)
  const imgSrc = tempCanvas.toDataURL('image/jpeg')
  document.querySelector('.meme-download').href = imgSrc
}

// ****************************** TEXT ************************************

function onSetFont(fontName) {
  const elDropdown = document.querySelector('.dropdown-container')
  //focus out from list after selecting by removing and adding hover effect
  elDropdown.classList.toggle('on')
  setTimeout(() => elDropdown.classList.toggle('on'), 500)

  updatePrefs({ font: fontName })
  updateTools('font')
  updateTextLines()
}

function updateTools(toolName = undefined) {
  const { font, color, outline, align, size } = getUserPrefs()
  const { text = '' } = getCurrLine() || {}

  const updators = {
    // Text line
    text: () => {
      const elTextInput = document.querySelector('.text-line')
      elTextInput.value = text
      elTextInput.focus()
    },
    // Font
    font: () => {
      const elSelectedFont = document.querySelector('.dropdown-container>span')
      elSelectedFont.setAttribute('name', font.toLowerCase())
      elSelectedFont.innerText = font
    },

    // Fill color
    color: () => {
      const elColorLabel = document.querySelector('[for=text-fill]')
      elColorLabel.style.backgroundColor = color
    },

    // Outline color
    outline: () => {
      const elColorLabel = document.querySelector('[for=text-outline]')
      elColorLabel.style.borderColor = outline
    },

    // Alignment
    align: () => {
      const alignBtns = [...document.querySelectorAll('.text-align > *')]
      alignBtns
        .map((elBtn) => elBtn.classList)
        .forEach((btnClasses) => {
          if (btnClasses.contains(`text-${align}`)) btnClasses.add('selected')
          else btnClasses.remove('selected')
        })
    },

    // Font size
    size: () => {
      const elSize = document.querySelector('.text-size .inner-input')
      elSize.innerText = size + 'px'
    },
  }

  // Emojies (support adding emojies)

  // Selected tool (pen/eraser)

  // Pen fill

  // Pen Weight

  //Update all tools or a specific one
  if (!toolName) Object.values(updators).forEach((cb) => cb())
  else updators[toolName]()
}

function onFillText({ target: { value: color } }) {
  updatePrefs({ color })
  updateTools('color')
  updateTextLines()
}

function onOutlineText({ target: { value: outline } }) {
  updatePrefs({ outline })
  updateTools('outline')
  updateTextLines()
}

function onRemoveLine() {
  removeLine()
  updateTextLines()
  updateSelectionCanvas()
}

function onAddText() {
  const LEFT_BOUND = 40
  const lineNum = getLines().length

  let x = LEFT_BOUND
  let y = _alignY(lineNum)
  let width = gElCanvases.text.clientWidth - x - x

  addLine(x, y, width)
  updateTools('text')
  updateTextLines()
  updateSelectionCanvas()
}

function onAlignText(alignment) {
  updatePrefs({ align: alignment })
  updateTools('align')
  updateTextLines()
}

function onSetFontSize(diff) {
  const { innerText: sizeStr } = document.querySelector(
    '.text-size .inner-input'
  )
  const size = +sizeStr.match(/\d+(?=px)/)[0] + diff

  updatePrefs({ size })
  updateTools('size')
  updateTextLines()
  updateSelectionCanvas()
}

function onSelectedLineChange(dir) {
  const lineIdx = getSelectedLineIdx() + dir
  setSelectedLineIdx(lineIdx)
  updateTools('text')
  updateSelectionCanvas()
}

function updateTextLines() {
  clearCanvas(gElCanvases.text, gCtxs.text)
  getLines().forEach(_renderLineWithWrap)
}

function _renderLineWithWrap(line) {
  setCtxPrefs(gCtxs.text, line)

  const PLACEHOLDER_TEXT = 'Add text here...'

  let { text = PLACEHOLDER_TEXT, x, y, width: textBoxWidth, align } = line

  let lineHeight = _getLineHeight()

  if (textBoxWidth <= 0) return

  // get words separated by space, check 1st word, if smaller than
  // maxWidth check the next word, and so on...
  // if found a word that is lengthier than maxWidth it means that all words
  // from previous weren't, so idx-- and splice them out to print a full line
  // within the width boundary. afterwards currLine++ and repeat.
  // at the end - calc the new height of the textbox

  let words = text.split(' ')
  let currLine = 0
  let idx = 1

  while (words.length > 0 && idx <= words.length) {
    let str = words.slice(0, idx).join(' ')
    let lineWidth = gCtxs.text.measureText(str).width
    if (lineWidth > textBoxWidth) {
      if (idx === 1) idx++
      printText(
        gCtxs.text,
        words.slice(0, idx - 1).join(' '),
        _alignX(align, x, textBoxWidth),
        y + lineHeight * currLine
      )
      currLine++

      words = words.splice(idx - 1)
      idx = 1
    } else idx++
  }

  if (idx > 0) {
    printText(
      gCtxs.text,
      words.slice(0, idx - 1).join(' '),
      _alignX(align, x, textBoxWidth),
      y + lineHeight * currLine
    )
  }

  updatePrefs({ height: lineHeight * (currLine + 1) })
}

function onSetText({ target: { value: text } }) {
  if (!getCurrLine()) onAddText()
  updatePrefs({ text })
  updateTools('text')
  updateTextLines()
  updateSelectionCanvas()
}

function _alignX(align, x, width = gElCanvases.text.width) {
  switch (align) {
    case 'center':
      return x + width / 2
    case 'left':
      return x
    case 'right':
      return x + width
  }
}

function _alignY(lineNum) {
  //return position for textY based on amount of text lines
  const MARGIN = 50
  const { height: canvasHeight } = gElCanvases.meme

  switch (lineNum) {
    case 0:
      return MARGIN
    case 1:
      return canvasHeight - MARGIN
    default:
      return canvasHeight / 2
  }
}

function _getLineHeight() {
  return calcLineHeight(gCtxs.text, 'example', getCurrLine() || getUserPrefs())
}

// ****************************** SELECTION *********************************

let gCurrSelection = {
  box: Path2D,
  resize: Path2D,
  isDrag: false,
  isResize: false,
}

function onTextSelect() {
  const { selection: ctx } = gCtxs
  const { x, y, width, height } = getCurrLine() || {}

  gCurrSelection.box = _renderBoundingBox(ctx, x, y, width, height)
  gCurrSelection.resize = _renderResizeIcon(ctx, x, y, width, height)

  gElCanvases.selection.addEventListener('mousemove', onMouseMove)
  gElCanvases.selection.addEventListener('mousedown', onMouseDown)
  gElCanvases.selection.addEventListener('mouseup', onMouseUp)
}

function _renderBoundingBox(ctx, x, y, width, height) {
  const boundingBox = new Path2D()

  const lineHeight = _getLineHeight()
  boundingBox.rect(x, y - lineHeight, width, height)
  setCtxPrefs(ctx, {
    lineWidth: 4,
    outline: '#ffffff80',
    lineDash: [4, 8],
    lineCap: 'round',
  })
  ctx.stroke(boundingBox)
  setCtxPrefs(ctx, {
    lineWidth: 8,
    outline: '#ffffff00',
    lineDash: [],
  })
  ctx.stroke(boundingBox)
  return boundingBox
}

function _renderResizeIcon(ctx, x, y, width, height) {
  const resizeIcon = new Path2D()

  const lineHeight = _getLineHeight()
  resizeIcon.arc(x + width, y - lineHeight / 2, 6, 0, 2 * Math.PI)
  setCtxPrefs(ctx, { color: 'red' })
  gCtxs.selection.fill(resizeIcon)
  return resizeIcon
}

function onMouseMove(ev) {
  if (gCurrSelection.isDrag) {
    const { clientX, clientY } = ev
    const { x, y } = gCurrSelection.selection

    const [dx, dy] = [clientX - x, clientY - y]

    const { x: textX, y: textY } = getCurrLine()
    updatePrefs({ x: textX + dx, y: textY + dy })

    updateTextLines()
    updateSelectionCanvas()

    gCurrSelection.selection = { x: clientX, y: clientY }
  } else if (gCurrSelection.isResize) {
    const { clientX } = ev
    const { x } = gCurrSelection.selection

    const dx = clientX - x

    const { x: textX, width: textWidth } = getCurrLine()
    updatePrefs({ x: textX - dx, width: textWidth + dx * 2 })

    updateTextLines()
    updateSelectionCanvas()
    gCurrSelection.selection = { x: clientX }
  } else {
    if (_isOnBoundingBox()) {
      gElCanvases.selection.style.cursor = 'grab'
    } else if (_isOnResizeIcon()) {
      gElCanvases.selection.style.cursor = 'col-resize'
    } else {
      gElCanvases.selection.style.cursor = 'auto'
    }
  }
}

function onMouseDown(ev) {
  const { clientX: x, clientY: y } = ev
  gCurrSelection.selection = { x, y }
  if (_isOnResizeIcon(x, y)) {
    gElCanvases.selection.style.cursor = 'col-resize'
    gCurrSelection.isResize = true
  } else if (_isOnBoundingBox(x, y)) {
    gCurrSelection.isDrag = true
    gElCanvases.selection.style.cursor = 'grabbing'
  }
}

function onMouseUp() {
  gCurrSelection.isDrag = false
  gCurrSelection.isResize = false
  gCurrSelection.selection = null
}

function updateSelectionCanvas() {
  _clearSelectionCanvas()
  onTextSelect()
}

function _clearSelectionCanvas() {
  clearCanvas(gElCanvases.selection, gCtxs.selection)
}

function _isOnBoundingBox(x, y) {
  return gCtxs.selection.isPointInStroke(gCurrSelection.box, x, y)
}

function _isOnResizeIcon(x, y) {
  return gCtxs.selection.isPointInPath(gCurrSelection.resize, x, y)
}
