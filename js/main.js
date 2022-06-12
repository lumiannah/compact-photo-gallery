
import { showCurrentImage } from './overlay.js'
import { API_URL } from '../apiurl.js'

export let galleryData = []

function fetchGalleryFiles() {
    fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        createGalleryItems(data)
    })
}

function createGalleryItems(data) {
    galleryData = data
    const gallery = document.querySelector('.grid-gallery')

    data.forEach((source, index) => {
        const newItem = document.createElement('div')
        const newImg = document.createElement('img')
        newItem.classList.add('grid-gallery-item')
        newImg.src = 'img/thumb/' + source.path
        newImg.dataset.index = index
        newItem.appendChild(newImg)
        newItem.addEventListener('pointerup', () => {
            showCurrentImage(index)
        })
        gallery.append(newItem)
    })
}


fetchGalleryFiles()















