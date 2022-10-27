'use strict'

const gImages = [
  {
    id: 0,
    path: '10.jpg',
  },
  {
    id: 1,
    path: '01.jpg',
  },
  {
    id: 2,
    path: '02.jpg',
  },
  {
    id: 3,
    path: '03.jpg',
  },
  {
    id: 4,
    path: '04.jpg',
  },
  {
    id: 5,
    path: '05.jpg',
  },
  {
    id: 6,
    path: '06.jpg',
  },
  {
    id: 7,
    path: '07.jpg',
  },
  {
    id: 8,
    path: '08.jpg',
  },
  {
    id: 9,
    path: '09.jpg',
  },
]

function getImgPath(imgId) {
  const img = gImages.find(({ id }) => id === imgId)
  if (!img) return null
  return img.path
}
