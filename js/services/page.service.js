'use strict'

const gMemeTemplates = [
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
  {
    id: 10,
    path: '10.jpg',
    tags: ['funny', 'jokes', 'spiderman', 'dog', 'lol'],
  },
  {
    id: 11,
    path: '11.jpg',
    tags: ['funny', 'jokes', 'dog', 'lol', 'wow', 'cool'],
  },
  {
    id: 12,
    path: '12.jpg',
    tags: ['funny', 'lol', 'wow', 'cool'],
  },
  {
    id: 13,
    path: '13.jpg',
    tags: ['funny', 'jokes', 'spiderman', 'wow', 'cool'],
  },
  {
    id: 14,
    path: '14.jpg',
    tags: ['funny', 'jokes', 'lol'],
  },
  {
    id: 15,
    path: '15.jpg',
    tags: ['funny', 'lol', 'wow', 'cool'],
  },
  {
    id: 16,
    path: '16.jpg',
    tags: ['spiderman', 'dog', 'lol', 'wow', 'cool'],
  },
  {
    id: 17,
    path: '17.jpg',
    tags: ['jokes', 'spiderman', 'dog', 'lol', 'wow', 'cool'],
  },
  {
    id: 18,
    path: '18.jpg',
    tags: ['funny', 'jokes', 'dog', 'lol', 'wow', 'cool'],
  },
  {
    id: 19,
    path: '19.jpg',
    tags: ['funny', 'spiderman', 'wow', 'cool', 'love'],
  },
  {
    id: 20,
    path: '20.jpg',
    tags: ['funny', 'jokes', 'spiderman', 'dog', 'lol'],
  },
  {
    id: 21,
    path: '21.jpg',
    tags: ['funny', 'jokes', 'dog', 'lol', 'wow', 'cool'],
  },
  {
    id: 22,
    path: '22.jpg',
    tags: ['funny', 'lol', 'wow', 'cool'],
  },
  {
    id: 23,
    path: '23.jpg',
    tags: ['funny', 'jokes', 'spiderman', 'wow', 'cool'],
  },
  {
    id: 24,
    path: '24.jpg',
    tags: ['funny', 'jokes', 'lol'],
  },
  // {
  //   id: 25,
  //   path: '25.jpg',
  //   tags: ['funny', 'lol', 'wow', 'cool'],
  // },
  // {
  //   id: 26,
  //   path: '26.jpg',
  //   tags: ['spiderman', 'dog', 'lol', 'wow', 'cool'],
  // },
  // {
  //   id: 27,
  //   path: '27.jpg',
  //   tags: ['jokes', 'spiderman', 'dog', 'lol', 'wow', 'cool'],
  // },
  // {
  //   id: 28,
  //   path: '28.jpg',
  //   tags: ['funny', 'jokes', 'dog', 'lol', 'wow', 'cool'],
  // },
  // {
  //   id: 29,
  //   path: '29.jpg',
  //   tags: ['funny', 'spiderman', 'wow', 'cool', 'love'],
  // },
  // {
  //   id: 30,
  //   path: '30.jpg',
  //   tags: ['funny', 'jokes', 'spiderman', 'dog', 'lol'],
  // },
  // {
  //   id: 31,
  //   path: '31.jpg',
  //   tags: ['funny', 'jokes', 'dog', 'lol', 'wow', 'cool'],
  // },
  // {
  //   id: 32,
  //   path: '32.jpg',
  //   tags: ['funny', 'lol', 'wow', 'cool'],
  // },
  // {
  //   id: 33,
  //   path: '33.jpg',
  //   tags: ['funny', 'jokes', 'spiderman', 'wow', 'cool'],
  // },
  // {
  //   id: 34,
  //   path: '34.jpg',
  //   tags: ['funny', 'jokes', 'lol'],
  // },
  // {
  //   id: 35,
  //   path: '35.jpg',
  //   tags: ['funny', 'lol', 'wow', 'cool'],
  // },
  // {
  //   id: 36,
  //   path: '36.jpg',
  //   tags: ['spiderman', 'dog', 'lol', 'wow', 'cool'],
  // },
  // {
  //   id: 37,
  //   path: '37.jpg',
  //   tags: ['jokes', 'spiderman', 'dog', 'lol', 'wow', 'cool'],
  // },
  // {
  //   id: 38,
  //   path: '38.jpg',
  //   tags: ['funny', 'jokes', 'dog', 'lol', 'wow', 'cool'],
  // },
  // {
  //   id: 39,
  //   path: '39.jpg',
  //   tags: ['funny', 'jokes', 'dog', 'lol', 'wow', 'cool'],
  // },
]

let gMemeTagsMap = new Map()
initMemeTagsMap()

let gMemeProjects
initMemeProjects()

function initMemeProjects() {
  gMemeProjects = loadFromStorage('memes') || []
}

function getMemeProjects({ filterBy }) {
  return gMemeProjects.filter(({ meta: { name } }) =>
    name.toLowerCase().includes(filterBy.toLowerCase())
  )
}

function saveMemeProject(memes) {
  saveToStorage('memes', memes)
  initMemeProjects()
}

function loadMemeProject(idx) {
  return gMemeProjects[idx]
}

function generateMemeIdx() {
  const { length } = loadFromStorage('memes') || []
  return length
}

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
      .filter((tag) => tag.includes(filterBy.toLowerCase()))
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
