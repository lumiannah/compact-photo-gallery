import { createOverlayButtons, toggleButtonsVisibility, hideInfoOverlay } from './buttons.js'
import { galleryData } from './main.js'

export let currentIndex = 0
let overlayActive = false

export const overlay = document.querySelector('.overlay')
const gallery = document.querySelector('.grid-gallery')



export function showCurrentImage(index) {
    showOverlay()
    const current = createOverlayImage(index)
    overlay.appendChild(current)
    currentIndex = index

    createOverlayButtons()
}

function createOverlayImage(index) {
    const overlayImage = document.createElement('img')
    overlayImage.src = 'img/overlay/' + galleryData[index].path
    overlayImage.addEventListener('pointerup', () => {
        toggleButtonsVisibility()
        hideInfoOverlay()
    })
    return overlayImage
}

function showNextImage() {
    if (galleryData[currentIndex+1]) {
        hideInfoOverlay()
        overlay.replaceChildren()
        const current = createOverlayImage(currentIndex)
        const next = createOverlayImage(currentIndex+1)
        currentIndex++
        overlay.append(current, next)

        createOverlayButtons()

        setTimeout(() => {
            current.classList.add('slide-left')
            next.classList.add('slide-left')
        }, 50);
        setTimeout(() => {
            current.style.visibility = 'hidden'
        }, 450);

    }
}

function showPrevImage() {
    if (galleryData[currentIndex-1]) {
        hideInfoOverlay()
        overlay.replaceChildren()
        const current = createOverlayImage(currentIndex)
        const prev = createOverlayImage(currentIndex-1)
        current.classList.add('slide-left')
        prev.classList.add('slide-left')
        currentIndex--
        overlay.append(prev, current)
        
        createOverlayButtons()

        setTimeout(() => {
            current.classList.remove('slide-left')
            prev.classList.remove('slide-left')
        }, 50);
        setTimeout(() => {
            current.style.visibility = 'hidden'
        }, 450);

    }
}

function showOverlay() {
    overlayActive = true
    overlay.replaceChildren()
    overlay.style.visibility = 'visible';
    gallery.classList.add('gallery-inactive')
    overlay.classList.add('overlay-active')
    document.documentElement.style.overflow = 'hidden'
    
}

export function hideOverlay() {
    overlayActive = false
    gallery.classList.remove('gallery-inactive')
    overlay.classList.remove('overlay-active')
    document.documentElement.style.overflow = ''
    //gallery.querySelector(`[data-index="${currentIndex}"]`).scrollIntoView()

    setTimeout(() => {
        overlay.style.visibility = '';
    }, 500);

    hideInfoOverlay()
}


overlay.ontouchstart = handleTouchStart
overlay.ontouchend = handleTouchEnd

let startX = 0;
let startY = 0;

function handleTouchStart(e) {
    startX = e.changedTouches[0].screenX;
    startY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    const diffX = e.changedTouches[0].screenX - startX;
    const diffY = e.changedTouches[0].screenY - startY;
    const ratioX = Math.abs(diffX / diffY);
    const ratioY = Math.abs(diffY / diffX);
    const absDiff = Math.abs(ratioX > ratioY ? diffX : diffY);

    // Ignore small movements.
    if (absDiff < 30) {
        return;
    }

    if (ratioX > ratioY) {
        if (diffX >= 0) {
            console.log('right swipe');
            showPrevImage()
        } else {
            console.log('left swipe');
            showNextImage()
        }
    } else {
        if (diffY >= 0) {
            /* console.log('down swipe');
            hideOverlay()
        } else { */
            /* console.log('up swipe');
            hideOverlay() */
        }
    }
}


window.addEventListener('keydown', function(e){
    if (overlayActive) {
        if (e.code === 'Escape') {
            hideOverlay()
            hideInfoOverlay()
        }
        if (e.code === 'ArrowUp') {
            toggleButtonsVisibility()
        }
        if (e.code === 'ArrowRight') {
            showNextImage()
        }
        if (e.code === 'ArrowLeft') {
            showPrevImage()
        }
    }
})


// works partically??

history.pushState(null, document.title, location.href)
window.addEventListener('popstate', function () {
    if(overlayActive) {
        hideOverlay()
    }
    history.pushState(null, document.title, location.href)
});