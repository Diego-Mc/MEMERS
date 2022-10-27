'use strict'

const gElCanvas = document.querySelector('[name=canvas]')
const gCtx = gElCanvas.getContext('2d')

window.addEventListener('load', onInit)

function onInit() {
  renderMeme()
}

function renderMeme() {
  const elImg = new Image()
  elImg.onload = () => {
    _setDimensionsByImg(elImg)
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
    renderLines() //text.controller
  }
  elImg.src = 'images/meme-templates/leo.jpg'
}

function _setDimensionsByImg(img) {
  const { naturalWidth: imgWidth, naturalHeight: imgHeight } = img
  const { clientHeight: cHeight, clientWidth: cWidth } = gElCanvas.parentNode

  const imgRatio = imgWidth / imgHeight

  const cStyle = gElCanvas.parentNode.style

  //check if inside mobile media query - based on that calc either width/height
  const isMobile = window.matchMedia('(max-width: 600px)').matches
  console.log(isMobile, imgHeight, imgWidth, cWidth, cHeight)

  const canvasWidth = isMobile ? cWidth : imgRatio * cHeight
  const canvasHeight = isMobile ? imgRatio * cWidth : cHeight

  //set sizes for all canvas layers
  setCanvasSize(gElCanvas, canvasWidth, canvasHeight)
  setCanvasSize(gElTxtCanvas, canvasWidth, canvasHeight)
  setCanvasSize(gElSelectionCanvas, canvasWidth, canvasHeight)

  if (isMobile) cStyle.height = canvasHeight
  else cStyle.width = canvasWidth
}

function _clearCanvas() {
  clearCanvas(gElCanvas, gCtx)
}
