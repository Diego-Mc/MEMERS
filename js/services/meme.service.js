'use strict'

const gMeme = {
  selectedImgId: 5,
  selectedLineIdx: -1,
  lines: [
    // {
    //   text: 'Hello world',
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

const gUserPrefs = {
  size: 36,
  font: 'Impact',
  align: 'center',
  color: 'white',
  outline: 'black',
}

function addLine(x, y, width) {
  const len = gMeme.lines.push({
    ...gUserPrefs,
    x,
    y,
    width,
  })
  setCurrLine(len - 1)
}

function updatePrefs(changes) {
  //take changes and apply them to defaultPrefs & to selected line
  const line = getCurrLine()
  for (const key in changes) {
    if (gUserPrefs[key]) gUserPrefs[key] = changes[key]
    if (line) line[key] = changes[key]
  }
}

function getUserPrefs() {
  return gUserPrefs
}

function removeLine() {
  const removed = gMeme.lines.splice(gMeme.selectedLineIdx, 1)[0]
  gMeme.selectedLineIdx--
  return removed
}

function getSelectedLineIdx() {
  return gMeme.selectedLineIdx
}

function setSelectedLineIdx(lineIdx) {
  const { length: len } = gMeme.lines
  if (len === 0) return (gMeme.selectedLineIdx = -1)

  gMeme.selectedLineIdx = (lineIdx + len) % len
}

function getCurrLine() {
  const { lines, selectedLineIdx } = gMeme
  return selectedLineIdx >= 0 ? lines[selectedLineIdx] : null
}

function getLines() {
  return gMeme.lines
}

// UPDATED^

function setCurrLine(idx) {
  gMeme.selectedLineIdx = idx
}

function getImgId() {
  return gMeme.selectedImgId
}

function setImgId(id) {
  gMeme.selectedImgId = id
}

function getMemeData() {
  return gMeme
}
