'use strict'

window.addEventListener('load', onInitGallery)

function onInitGallery() {
  const onClick = addEventHandler('click')

  onRenderGallery()

  onClick('.projects-link', onRenderProjects)
  onClick('.gallery-link', onRenderGallery)
  onClick('.flexible-btn', () => editMeme(getRandImgId()))
  onClick('.logo', onRenderGallery)
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
  _clearSearch()
  _setSearchEvent(_renderMemeTemplates)
}

function _clearSearch() {
  document.querySelector('.searchbar input').value = ''
}

function _setSearchEvent(cb) {
  document.querySelector('.searchbar input').oninput = ({
    target: { value },
  }) => cb(value)
}

function onRenderProjects() {
  document.querySelector('.filter-items').innerHTML = ''
  _renderProjects()
  _addMemeTemplateCb(editProject)
  _resetDataList()
  _clearSearch()
  _setSearchEvent(_renderProjects)
}

function _renderProjects(filterBy = '') {
  const memeProjectsHTML = getMemeProjects({ filterBy })
    .map(
      ({ meta: { idx, name, memePreview } }) =>
        `
          <article class="meme-project-card">
           <img
             class="img-item meme-preview"
             src="${memePreview}"
             alt=${name}
             data-id="${idx}" />
           <p class="project-name">${name}</p>
         </article>`
    )
    .join('')
  document.querySelector('.image-gallery').innerHTML = memeProjectsHTML
}

function _isHorizontal(ratio) {
  return ratio > 1.3
}
function _isVertical(ratio) {
  return ratio < 0.7
}

function editProject(memeIdx) {
  initMemeEditor({ memeIdx })
  document.querySelector('.meme-editor').classList.remove('d-none')
  memeSetup()
}

function _renderMemeTemplates(filterBy = '') {
  const memeTemplates = getMemeTemplates({ filterBy })
  const memeTemplateImagesHTML = memeTemplates
    .map(({ id, path }) => {
      const img = new Image()
      img.src = `images/meme-templates/${path}`
      img.onload = function () {
        const { naturalWidth: w, naturalHeight: h } = this
        const elImg = document.querySelector(`[data-id="${id}"]`)
        if (_isHorizontal(w / h)) elImg.classList.add('horizontal')
        else if (_isVertical(w / h)) elImg.classList.add('vertical')
      }
      return `<img
          class="img-item"
          src="images/meme-templates/${path}"
          data-id="${id}" />`
    })
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

function _resetDataList() {
  document.querySelector('#tags').innerHTML = ''
}

function _addMemeTemplateCb(cb) {
  const elImages = [...document.querySelectorAll('.img-item')]

  elImages.forEach((elImg) =>
    elImg.addEventListener('click', () => cb(elImg.dataset.id))
  )
}
