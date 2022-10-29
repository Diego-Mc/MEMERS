'use strict'

//TODO: remove for prod
let gMeme = {
  meta: { idx: 0, name: 'Untitled Meme Project', imgId: 5, memePreview: '' },
  selectedLineIdx: -1,
  lines: [],
  userPrefs: {
    size: 36,
    font: 'Impact',
    align: 'center',
    color: 'white',
    outline: 'black',
  },
}

function initMemeEditor(data) {
  console.log(data)
  const { imgId, memeIdx } = data
  const meme = {
    meta: {
      imgId: imgId || getRandImgId(),
      idx: generateMemeIdx(),
      name: '',
    },
    selectedLineIdx: -1,
    lines: [],
    userPrefs: {
      size: 36,
      font: 'Impact',
      align: 'center',
      color: 'white',
      outline: 'black',
    },
  }

  gMeme = loadMeme(memeIdx) || meme
}

function generateMemeIdx() {
  const { length } = loadFromStorage('memes') || {}
  return length
}

function addLine(x, y, width) {
  const len = gMeme.lines.push({
    ...gMeme.userPrefs,
    x,
    y,
    width,
  })
  setCurrLine(len - 1)
}

function updatePrefs(changes, line = undefined) {
  //take changes and apply them to defaultPrefs & to selected line
  line = line || getCurrLine()
  for (const key in changes) {
    if (gMeme.userPrefs[key]) gMeme.userPrefs[key] = changes[key]
    if (line) line[key] = changes[key]
  }
}

function getUserPrefs() {
  return gMeme.userPrefs
}

function removeLine() {
  if (gMeme.selectedLineIdx < 0) return

  const removed = gMeme.lines.splice(gMeme.selectedLineIdx, 1)[0]
  gMeme.selectedLineIdx--
  return removed
}

function getSelectedLineIdx() {
  return gMeme.selectedLineIdx
}

function setSelectedLineIdx(lineIdx) {
  const { length: len } = gMeme.lines
  if (len === 0) return unsetSelectedLineIdx()

  gMeme.selectedLineIdx = (lineIdx + len) % len
}

function unsetSelectedLineIdx() {
  gMeme.selectedLineIdx = -1
}

function getCurrLine() {
  const { lines, selectedLineIdx } = gMeme
  return selectedLineIdx >= 0 ? lines[selectedLineIdx] : null
}

function getLine(idx) {
  return gMeme.lines[idx]
}

function setCurrLine(idx) {
  gMeme.selectedLineIdx = idx
}

function getLines() {
  return gMeme.lines
}

function getImgId() {
  return gMeme.meta.imgId
}

function getMemeData() {
  return gMeme
}

function loadMeme(idx) {
  const memes = loadFromStorage('memes')
  if (!memes || !memes[idx]) return false
  return memes[idx]
}

function saveMeme(metaArgs) {
  const memes = loadFromStorage('memes') || []
  gMeme.meta = { ...gMeme.meta, ...metaArgs }
  memes[gMeme.meta.idx] = gMeme
  saveToStorage('memes', memes)
}
