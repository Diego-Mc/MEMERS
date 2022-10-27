'use strict'

window.addEventListener('load', onInitGallery)

function onInitGallery() {
  console.log('HEYY')
  const elImages = [...document.querySelectorAll('.img-item')]

  elImages.forEach((elImg) =>
    elImg.addEventListener('click', () => editMeme(elImg.dataset.id))
  )
}

function editMeme(imgId) {
  setImgId(+imgId)
  document.querySelector('.meme-editor').classList.remove('d-none')
  renderMeme()
}
