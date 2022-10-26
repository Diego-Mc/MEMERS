'use strict'

const gMeme = {
  selectedImgId: 5,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'Hello world',
      font: 'serif',
      size: 20,
      align: 'left',
      color: 'red',
      x: 100,
      y: 50,
    },
  ],
}

function addText(size, font, align, color, x, y) {
  gMeme.lines.push({
    txt: '',
    font,
    size,
    align,
    color,
    x,
    y,
  })
}

function setText(txt) {
  getCurrLine().txt = txt
}

function textSwitch(dir) {
  const { selectedLineIdx, lines } = gMeme
  gMeme.selectedLineIdx = (lines.length + selectedLineIdx + dir) % lines.length
  return getCurrLine()
}

function getCurrLine() {
  return gMeme.lines[gMeme.selectedLineIdx]
}

function getMemeData() {
  return gMeme
}
