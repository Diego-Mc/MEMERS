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

window.addEventListener('load', onMemeInit)
window.addEventListener('resize', renderMeme)

// ********************************* MEME ************************************

function onMemeInit() {
  _addEventListeners()
  setCtxPrefs(gCtxs.text, { lineWidth: 2, textBaseline: 'middle' })
}

function memeSetup() {
  renderMeme()
  updateTools()
}

function _addEventListeners() {
  // HANDLERS (util):
  const onInput = addEventHandler('input')
  const onClick = addEventHandler('click')

  // TOOLS:
  onClick('.text-add', onAddText)
  onClick('.text-switch .text-up-down', () => onSelectedLineChange(+1))
  onInput('.text-line', onSetText)
  onClick('.trash', onRemoveLine)
  onClick('.dropdown-item[name=impact]', () => onSetFont('Impact'))
  onClick('.dropdown-item[name="secular one"]', () => onSetFont('Secular One'))
  onClick('.dropdown-item[name=rubik]', () => onSetFont('Rubik'))
  onClick('.dropdown-item[name=montserrat]', () => onSetFont('Montserrat'))
  onClick('.font-decrease', () => onSetFontSize(-1))
  onClick('.font-increase', () => onSetFontSize(+1))
  onClick('.text-left', (ev) => onAlignText(ev, 'left'))
  onClick('.text-center', (ev) => onAlignText(ev, 'center'))
  onClick('.text-right', (ev) => onAlignText(ev, 'right'))
  onClick('.text-align', (ev) => onAlignText(ev))
  onInput('#text-fill', onFillText)
  onInput('#text-outline', onOutlineText)
  Array.from(document.querySelectorAll('.emoji span')).forEach((emoji) =>
    onClick(emoji, () => onAddEmoji(emoji))
  )

  // SOCIAL:
  onClick('.bi-download', onDownloadMeme)
  onClick('.bi-share-fill', onShare)

  // SAVE MEME:
  onClick('.save-meme', onSaveMeme)

  //CLOSE MEME:
  onClick('.close-btn', onCloseEditor)
}

function onCloseEditor() {
  document.querySelector('.meme-editor').classList.add('d-none')
}

function onAddEmoji({ innerText: emoji }) {
  const { width, height } = gElCanvases.meme
  const { size } = getUserPrefs()
  addLine(width / 2, height / 2, size)
  updatePrefs({ text: emoji })
  updateTools('text')
  updateTextLines()
  updateSelectionCanvas()
}

function renderMeme() {
  const canvases = Object.values(gElCanvases)
  const elImg = new Image()

  elImg.onload = () => {
    const { naturalWidth: imgWidth, naturalHeight: imgHeight } = elImg
    const { width, height } = _getAspectCanvasSize(imgWidth / imgHeight)

    canvases.forEach((canvas) => setCanvasSize(canvas, width, height))
    gCtxs.meme.drawImage(elImg, 0, 0, width, height)

    updateTextLines()
    updateSelectionCanvas()
    _renderMemeName()
  }

  const imgId = getImgId()
  elImg.src = `images/meme-templates/${getImgPath(imgId)}`
}

function _renderMemeName() {
  const { name: memeName = '' } = getMemeMeta()
  document.querySelector('.proj-name input').value = memeName
}

function onSaveMeme() {
  let { value: name } = document.querySelector('.proj-name input')
  name = name || 'Untitled meme project'
  const memePreview = getCanvasAsImgSrc()
  saveMeme({ name, memePreview })

  const userMsg = `Meme saved with title: ${name}`
  _showUserMsg(userMsg)
}

function _showUserMsg(msg) {
  const elMsgContainer = document.querySelector('.user-msg')
  const elMsgText = elMsgContainer.querySelector('p')

  elMsgText.innerText = msg
  elMsgContainer.classList.remove('d-none')
  setTimeout(() => {
    elMsgContainer.classList.add('d-none')
  }, 2000)
}

function _getAspectCanvasSize(ratio) {
  const canvasContainer = gElCanvases.meme.parentNode

  const { clientHeight, clientWidth } = canvasContainer

  const cHeight = parseInt(clientHeight)
  const cWidth = parseInt(clientWidth)

  const ratioWidth = parseInt(cHeight * ratio)
  const ratioHeight = parseInt(cWidth / ratio)

  const width = ratioWidth > cWidth ? cWidth : ratioWidth
  const height = ratioHeight > cHeight ? cHeight : ratioHeight

  return { width, height }
}

function _clearMemeCanvas() {
  clearCanvas(gElCanvases.meme, gCtxs.meme)
}

function onDownloadMeme() {
  const imgSrc = getCanvasAsImgSrc()
  const { value: memeName } = document.querySelector('.proj-name input')
  const elImageLink = document.querySelector('.meme-download')
  elImageLink.href = imgSrc
  elImageLink.download = memeName
  elImageLink.click()
}

function onShare() {
  const { name: memeName } = getMemeMeta()
  const data = getCanvasAsImgSrc()
  memeName = memeName || 'Untitled meme'
  shareCanvas(data, memeName)
}

function getCanvasAsImgSrc() {
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = gElCanvases.meme.width
  tempCanvas.height = gElCanvases.meme.height
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.drawImage(gElCanvases.meme, 0, 0)
  tempCtx.drawImage(gElCanvases.text, 0, 0)
  return tempCanvas.toDataURL('image/jpeg')
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
  const { font, color, outline, align, size } = {
    ...getUserPrefs(),
    ...getCurrLine(),
  }
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
      document
        .querySelector(`.text-font .dropdown-menu .selected`)
        .classList.remove('selected')
      document
        .querySelector(
          `.text-font .dropdown-menu [name="${font.toLowerCase()}"]`
        )
        .classList.add('selected')
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

function onAlignText(ev, alignment) {
  ev.stopPropagation()
  if (!alignment) {
    const { align: currAlignment } = getUserPrefs()
    alignment =
      currAlignment === 'center'
        ? 'right'
        : currAlignment === 'right'
        ? 'left'
        : 'center'
  }
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
  updateTools()
  updateTextLines()
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

  let lineHeight = _getLineHeight(line)

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

  updatePrefs({ height: lineHeight * (currLine + 1) }, line)
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
  const MARGIN = 60
  const { height: canvasHeight } = gElCanvases.meme
  const lineHeight = _getLineHeight()

  switch (lineNum) {
    case 0:
      return MARGIN + lineHeight / 2
    case 1:
      return canvasHeight - MARGIN + lineHeight / 2
    default:
      return canvasHeight / 2 + lineHeight / 2
  }
}

function _getLineHeight(line = undefined) {
  const textCtx = gCtxs.text
  textCtx.save()
  const lineHeight = calcLineHeight(
    textCtx,
    'example',
    line || getCurrLine() || getUserPrefs()
  )
  textCtx.restore()
  return lineHeight
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

  // gElCanvases.selection.addEventListener('touchmove', onTouchMove)
  // gElCanvases.selection.addEventListener('touchstart', onTouchStart)
  // gElCanvases.selection.addEventListener('touchend', onTouchEnd)

  gElCanvases.selection.addEventListener('mousemove', onMouseMove)
  gElCanvases.selection.addEventListener('mousedown', onMouseDown)
  gElCanvases.selection.addEventListener('mouseup', onMouseUp)
}

//TODO: add touch support
// function onTouchStart(ev) {
//   ev.preventDefault()
// }

// function onTouchMove(ev) {
//   const rect = canvas.getBoundingClientRect()
//   const cssX = e.touches[0].clientX - rect.left
//   const cssY = e.touches[0].clientY - rect.top
//   const pixelX = (cssX * canvas.width) / rect.width
//   const pixelY = (cssY * canvas.height) / rect.height
// }

// function onTouchEnd(ev) {}

function onMouseMove(ev) {
  if (gCurrSelection.isDrag) _onDrag(ev)
  else if (gCurrSelection.isResize) _onResize(ev)
  else _onMouseMove(ev)
}

function _onDrag({ offsetX, offsetY }) {
  const { x, y } = gCurrSelection.selection

  const [dx, dy] = [offsetX - x, offsetY - y]

  const { x: textX, y: textY } = getCurrLine()
  updatePrefs({ x: textX + dx, y: textY + dy })

  updateTextLines()
  updateSelectionCanvas()

  gCurrSelection.selection = { x: offsetX, y: offsetY }
}

function _onResize({ offsetX }) {
  const { x } = gCurrSelection.selection

  const dx = offsetX - x

  const { x: textX, width: textWidth } = getCurrLine()
  updatePrefs({ x: textX - dx, width: textWidth + dx * 2 })

  updateTextLines()
  updateSelectionCanvas()
  gCurrSelection.selection = { x: offsetX }
}

function onMouseDown(ev) {
  ev.preventDefault()
  const { offsetX: x, offsetY: y } = ev
  gCurrSelection.selection = { x, y }
  const hoverTextIdx = getHoverTextIdx(x, y)
  if (_isOnResizeIcon(x, y)) {
    gElCanvases.selection.style.cursor = 'col-resize'
    gCurrSelection.isResize = true
  } else if (_isOnBoundingBox(x, y)) {
    gCurrSelection.isDrag = true
    gElCanvases.selection.style.cursor = 'grabbing'
  } else if (hoverTextIdx >= 0) {
    //select the box user hovered on (only if was unselected)
    setSelectedLineIdx(hoverTextIdx)
    updateTextLines()
    updateTools()
    updateSelectionCanvas()
  } else {
    // stop selecting a line (for better preview UX)
    unsetSelectedLineIdx()
    updateSelectionCanvas()
    updateTools()
    updateTextLines()
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

function _renderHoverBox(ctx, line) {
  const hoverBox = new Path2D()

  const { x, y, width, height } = line
  const lineHeight = _getLineHeight(line)
  hoverBox.rect(x, y - lineHeight, width, height)
  setCtxPrefs(ctx, { color: '#f1f1a144' })
  ctx.fill(hoverBox)
  return hoverBox
}

function _renderResizeIcon(ctx, x, y, width, height) {
  const resizeIcon = new Path2D()

  const lineHeight = _getLineHeight()
  resizeIcon.arc(x + width, y - lineHeight / 2, 8, 0, 2 * Math.PI)
  setCtxPrefs(ctx, { color: 'red' })
  gCtxs.selection.fill(resizeIcon)
  return resizeIcon
}

function _onMouseMove({ offsetX: x, offsetY: y }) {
  gCurrSelection.selection = { x, y }
  const hoverTextIdx = getHoverTextIdx(x, y)
  if (_isOnResizeIcon(x, y)) {
    gElCanvases.selection.style.cursor = 'col-resize'
  } else if (_isOnBoundingBox(x, y)) {
    gElCanvases.selection.style.cursor = 'grab'
  } else {
    gElCanvases.selection.style.cursor = 'auto'
    if (hoverTextIdx >= 0) {
      _clearSelectionCanvas()
      _renderHoverBox(gCtxs.selection, getLine(hoverTextIdx))
    } else {
      updateSelectionCanvas()
    }
  }
}

function isInArea({ x: offsetX, y: offsetY }, line) {
  const { x, y, width, height } = line
  const lineHeight = _getLineHeight(line)
  return (
    offsetX > x &&
    offsetY > y - lineHeight &&
    offsetX < x + width &&
    offsetY < y + height
  )
}

function getHoverTextIdx(x, y) {
  return getLines().findIndex((line, id) => {
    if (id === getSelectedLineIdx()) return false
    return isInArea({ x, y }, line)
  })
}
