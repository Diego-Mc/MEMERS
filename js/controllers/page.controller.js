'use strict'

window.addEventListener('load', onInitGallery)

function onInitGallery() {
  document
    .querySelector('.projects-link')
    .addEventListener('click', onRenderProjects)

  document
    .querySelector('.gallery-link')
    .addEventListener('click', onRenderGallery)
  ;[...document.querySelectorAll('.filter-item')].forEach((elItem) =>
    elItem.addEventListener('click', () => onFilterSelect(elItem))
  )

  onRenderGallery()
}

function onFilterSelect(el) {
  const size = parseInt(getComputedStyle(el).getPropertyValue('font-size'))
  console.log(size)
  el.style.fontSize = size + 1 + 'px'
}

function editMeme(imgId) {
  initMemeEditor({ imgId: +imgId })
  document.querySelector('.meme-editor').classList.remove('d-none')
  memeSetup()
}

function onRenderGallery() {
  const memeTemplates = getMemeTemplates()

  const memeTemplateImagesHTML = memeTemplates
    .map(
      ({ id, path }) => `<img
          class="img-item"
          src="images/meme-templates/${path}"
          data-id="${id}" />`
    )
    .join('')
  document.querySelector('.image-gallery').innerHTML = memeTemplateImagesHTML

  const memeTagsMap = getMemeTagsMap()
  const tags = Array.from(memeTagsMap.keys())

  const tagsHTML = tags
    .map(
      (tag) =>
        `<article class="filter-item" data-relevance=${
          memeTagsMap.get(tag).length
        }><p>${tag}</p></article>`
    )
    .join('')

  document.querySelector('.filter-items').innerHTML = tagsHTML

  const elImages = [...document.querySelectorAll('.img-item')]

  elImages.forEach((elImg) =>
    elImg.addEventListener('click', () => editMeme(elImg.dataset.id))
  )
}

function onRenderProjects() {
  const memeProjectsHTML = loadFromStorage('memes')
    .map(
      ({ meta: { idx, name, memePreview } }) => `<img
          class="img-item meme-preview"
          src="${memePreview}"
          data-id="${idx}"
          alt=${name} />`
    )
    .join('')
  document.querySelector('.image-gallery').innerHTML = memeProjectsHTML

  const elImages = [...document.querySelectorAll('.img-item')]

  elImages.forEach((elImg) =>
    elImg.addEventListener('click', () => editProject(elImg.dataset.id))
  )
}

function editProject(memeIdx) {
  initMemeEditor({ memeIdx })
  document.querySelector('.meme-editor').classList.remove('d-none')
  memeSetup()
}
