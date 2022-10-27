'use strict'

const gElTxtCanvas = document.querySelector('[name=canvas-txt]')
const gTxtCtx = gElTxtCanvas.getContext('2d')

const PLACEHOLDER_TXT = 'Add text here...'
const gPADDING = 20

const LEFT_BOUND = 40 //margin left
const RIGHT_BOUND = 40 //margin right

const gDefaultVals = {
  size: 36,
  font: 'serif',
  align: 'center',
  color: 'purple',
}

let gCurrAlign = 'center'

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
  let { size, font, align, color } = getCurrLine() || gDefaultVals
  let txt = PLACEHOLDER_TXT
  let x = LEFT_BOUND
  let y =
    len === 0 ? 50 : len === 1 ? gElCanvas.height - 50 : gElCanvas.height / 2
  let width = gElTxtCanvas.clientWidth - x - x
  let height = calcLineHeight(gTxtCtx, txt, { size, font })

  addText(x, y, width, height, size, font, align, color)
  renderLines()
  onTextSelect(getCurrLine())
}

//TODO: change txt for text
function onAlignTxt(alignStr) {
  //TODO: add radio behaviour with css .selected
  gCurrAlign = alignStr
  alignText(alignStr)
  renderLines()
}

function onSetFontSize(diff) {
  const elSizeInput = document.querySelector('.text-size input')
  const value = +elSizeInput.value.match(/\d+(?=px)/)[0]
  elSizeInput.value = value + diff + 'px'
  setFontSize(diff)
  renderLines()
}

function onTextSwitch(dir) {
  const newLine = textSwitch(dir)

  if (!newLine) return

  _updateTextInput(newLine)
  onTextSelect(newLine)

  document.querySelector('.text-size input').value = newLine.size + 'px'
}

function renderLine(line) {
  let { txt, size, font, align, color } = line
  gTxtCtx.font = `${size}px ${font}`
  gTxtCtx.fillStyle = color
  txt = txt || PLACEHOLDER_TXT
  gTxtCtx.textBaseline = 'middle'
  gTxtCtx.textAlign = align

  // printWordWrap(
  //   txt,
  //   alignX(align, x, width),
  //   y + PADDING,
  //   width - PADDING,
  //   size,
  //   font
  // )
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

  let { x, y, width } = line

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
        alignX(x, width),
        y + lineHeight * currLine
      )
      line.height += lineHeight
      currLine++
      words = words.splice(idx - 1)
      idx = 1
    } else idx++
  }
  if (idx > 0) {
    gTxtCtx.fillText(
      words.slice(0, idx - 1).join(' '),
      alignX(x, width),
      y + lineHeight * currLine
    )
  }
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

function alignX(x, width = gElTxtCanvas.width) {
  switch (gCurrAlign) {
    case 'center':
      return width / 2
    case 'left':
      return x + gPADDING
    case 'right':
      return x + width - gPADDING
  }
}

function _clearTxtCanvas() {
  clearCanvas(gElTxtCanvas, gTxtCtx)
}
