'use strict'

window.addEventListener('load', onInitGallery)

function onInitGallery() {
  const onClick = addEventHandler('click')
  const onInput = addEventHandler('input')

  onRenderGallery()

  onClick('.projects-link', onRenderProjects)
  onClick('.gallery-link', onRenderGallery)
  onInput('.searchbar input', ({ target: { value } }) =>
    _renderMemeTemplates(value)
  )
  onClick('.flexible-btn', () => editMeme(getRandImgId()))
}

function onFilterSelect(el) {
  growTag(el, +1)
  _renderMemeTemplates(el.innerText)
  document.querySelector('.searchbar input').value = el.innerText
}

function growTag(elTag, diff) {
  const size = parseInt(getComputedStyle(elTag).getPropertyValue('font-size'))
  elTag.style.fontSize = size + +diff + 'px'

  // TODO: change for spanning in grid to grow
}

function editMeme(imgId) {
  initMemeEditor({ imgId: +imgId })
  document.querySelector('.meme-editor').classList.remove('d-none')
  memeSetup()
}

function onRenderGallery() {
  _renderMemeTemplates()
  _renderTags()
  _updateDataList()
}

function onRenderProjects() {
  document.querySelector('.filter-items').innerHTML = ''

  const memeProjectsHTML = getMemeProjects()
    .map(
      ({ meta: { idx, name, memePreview } }) => `<img
          class="img-item meme-preview"
          src="${memePreview}"
          data-id="${idx}"
          alt=${name} />`
    )
    .join('')
  document.querySelector('.image-gallery').innerHTML = memeProjectsHTML

  _addMemeTemplateCb(editProject)
}

function editProject(memeIdx) {
  initMemeEditor({ memeIdx })
  document.querySelector('.meme-editor').classList.remove('d-none')
  memeSetup()
}

function _renderMemeTemplates(filterBy = '') {
  const memeTemplates = getMemeTemplates({ filterBy })
  const memeTemplateImagesHTML = memeTemplates
    .map(
      ({ id, path }) => `<img
          class="img-item"
          src="images/meme-templates/${path}"
          data-id="${id}" />`
    )
    .join('')
  document.querySelector('.image-gallery').innerHTML = memeTemplateImagesHTML

  _addMemeTemplateCb(editMeme)
}

function _renderTags() {
  const tags = getMemeTags()

  const tagsHTML = tags
    .map(
      (tag) =>
        `<article class="filter-item" data-relevance=${
          getMemeTemplatesForTag(tag).length
        }><p>${tag}</p></article>`
    )
    .join('')

  document.querySelector('.filter-items').innerHTML = tagsHTML
  const elTags = Array.from(document.querySelectorAll('.filter-item'))

  elTags.forEach((elTag) =>
    elTag.addEventListener('click', () => onFilterSelect(elTag))
  )
  elTags.forEach((elTag) => growTag(elTag, elTag.dataset.relevance))
}

function _updateDataList() {
  const tags = getMemeTags()

  const datalistHTML = tags.map(
    (tag) => `
  <option value="${tag}" label="${
      getMemeTemplatesForTag(tag).length
    }">${tag}</option>
  `
  )

  document.querySelector('#tags').innerHTML = datalistHTML
}

function _addMemeTemplateCb(cb) {
  const elImages = [...document.querySelectorAll('.img-item')]

  elImages.forEach((elImg) =>
    elImg.addEventListener('click', () => cb(elImg.dataset.id))
  )
}
