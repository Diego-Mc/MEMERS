'use strict'

const elCanvas = document.querySelector('[name=canvas]')
const gCtx = elCanvas.getContext('2d')

function onInit() {
  document.querySelector('.text-add').addEventListener('click', onAddText)
  document
    .querySelector('.text-switch .text-up')
    .addEventListener('click', () => onTextSwitch(+1))
  document
    .querySelector('.text-switch .text-down')
    .addEventListener('click', () => onTextSwitch(-1))

  document.querySelector('.text-line').addEventListener('input', onSetText)
  renderMeme()
}

function drawImg(img) {
  const { naturalWidth: imgWidth, naturalHeight: imgHeight } = img
  const { clientHeight: clientHeight } = elCanvas.parentNode

  const imgRatio = imgWidth / imgHeight

  const canvasHeight = clientHeight
  const canvasWidth = imgRatio * clientHeight

  elCanvas.height = canvasHeight
  elCanvas.width = canvasWidth

  gCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight)
}

function onSetText({ target }) {
  setText(target.value)
  gCtx.clearRect(0, 0, elCanvas.clientWidth, elCanvas.clientHeight)
  renderMeme()
}

function onAddText() {
  // gCtx.font = '48px serif'
  // gCtx.textAlign = 'center'
  // gCtx.fillText('HELLO', 0, 50, elCanvas.clientWidth)
  addText(
    48,
    'serif',
    'center',
    'red',
    Math.random() * 300 + 50,
    Math.random() * 500 + 100
  )
  renderMeme()
}

function onTextSwitch(dir) {
  const { txt } = textSwitch(dir)
  document.querySelector('.text-line').value = txt
}

function renderMeme() {
  const elImg = new Image()
  elImg.onload = () => {
    drawImg(elImg)
    const memeData = getMemeData()
    const { lines } = memeData

    lines.forEach(renderTxt)
  }
  elImg.src = 'images/meme-templates/leo.jpg'
}

function renderTxt({ txt, size, font, align, color, x, y }) {
  gCtx.font = `${size}px ${font}`
  gCtx.textAlign = align
  gCtx.fillStyle = color
  txt = txt || 'Add text here..'
  gCtx.fillText(txt, x, y)
}
