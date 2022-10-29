'use strict'

const gMemeTemplates = [
  {
    id: 0,
    path: '10.jpg',
    tags: ['funny', 'jokes', 'spiderman', 'dog', 'lol'],
  },
  {
    id: 1,
    path: '01.jpg',
    tags: ['funny', 'jokes', 'dog', 'lol', 'wow', 'cool'],
  },
  {
    id: 2,
    path: '02.jpg',
    tags: ['funny', 'lol', 'wow', 'cool'],
  },
  {
    id: 3,
    path: '03.jpg',
    tags: ['funny', 'jokes', 'spiderman', 'wow', 'cool'],
  },
  {
    id: 4,
    path: '04.jpg',
    tags: ['funny', 'jokes', 'lol'],
  },
  {
    id: 5,
    path: '05.jpg',
    tags: ['funny', 'lol', 'wow', 'cool'],
  },
  {
    id: 6,
    path: '06.jpg',
    tags: ['spiderman', 'dog', 'lol', 'wow', 'cool'],
  },
  {
    id: 7,
    path: '07.jpg',
    tags: ['jokes', 'spiderman', 'dog', 'lol', 'wow', 'cool'],
  },
  {
    id: 8,
    path: '08.jpg',
    tags: ['funny', 'jokes', 'dog', 'lol', 'wow', 'cool'],
  },
  {
    id: 9,
    path: '09.jpg',
    tags: ['funny', 'spiderman', 'wow', 'cool', 'love'],
  },
]

let gMemeTagsMap = new Map()
initMemeTagsMap()

function initMemeTagsMap() {
  // create a map for instant search results later (& tags handling)
  gMemeTemplates.forEach((template) => {
    template.tags.forEach((tag) => {
      if (gMemeTagsMap.has(tag))
        gMemeTagsMap.set(tag, [...gMemeTagsMap.get(tag), template])
      else gMemeTagsMap.set(tag, [template])
    })
  })
}

function getImgPath(imgId) {
  const img = gMemeTemplates.find(({ id }) => id === imgId)
  if (!img) return null
  return img.path
}

function getRandImgId() {
  return gMemeTemplates[getRandomInt(0, gMemeTemplates.length)].id
}

function getMemeTemplates({ filterBy }) {
  return [
    ...getMemeTags()
      .filter((tag) => tag.includes(filterBy))
      .map(getMemeTemplatesForTag)
      .reduce((set, templates) => new Set([...set, ...templates]), new Set()),
  ]
}

function getMemeTags() {
  return Array.from(gMemeTagsMap.keys())
}

function getMemeTemplatesForTag(tag) {
  return gMemeTagsMap.get(tag)
}
