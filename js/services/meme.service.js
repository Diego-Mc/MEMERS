'use strict'

const gMeme = {
  selectedImgId: 5,
  selectedLineIdx: -1,
  lines: [
    // {
    //   txt: 'Hello world',
    //   font: 'serif',
    //   size: 20,
    //   align: 'left',
    //   color: 'red',
    //   x: 80,
    //   y: 30,
    //   width: 300,
    //   height: 90,
    // },
  ],
}

function addText(x, y, width, height, size, font, align, color) {
  gMeme.lines.push({
    size,
    font,
    align,
    color,
    txt: '',
    x,
    y,
    width,
    height,
  })
  textSwitch(+1)
}

function getDefaultTextVals() {
  return gDefaultVals
}

function setText(txt) {
  if (!gMeme.lines.length) return
  getCurrLine().txt = txt
}

function alignText(alignStr) {
  const { selectedLineIdx, lines } = gMeme

  if (!lines.length) return

  lines[selectedLineIdx].align = alignStr
}

function removeText() {
  if (!gMeme.lines.length) return
  const removed = gMeme.lines.splice(gMeme.selectedLineIdx, 1)[0]
  textSwitch(-1)
  return removed
}

function setFontSize(diff) {
  const { selectedLineIdx, lines } = gMeme

  if (!lines.length) return

  lines[selectedLineIdx].size += diff
}

function textSwitch(dir) {
  const { selectedLineIdx, lines } = gMeme

  if (!lines.length) return

  gMeme.selectedLineIdx = (lines.length + selectedLineIdx + dir) % lines.length
  return getCurrLine()
}

function getCurrLine() {
  if (!gMeme.lines.length) return

  return gMeme.lines[gMeme.selectedLineIdx]
}

function getLines() {
  return gMeme.lines
}

function getMemeData() {
  return gMeme
}
