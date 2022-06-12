import { galleryData } from './main.js'
import { hideOverlay, overlay, currentIndex } from './overlay.js'

let buttonsVisibility = false
let infoOverlayActive = false


// icons @ fontawesome
const overlayButtons = [
    {
        identifier: 'return',
        event: hideOverlay,
        viewBox: '0 0 448 512',
        path: 'M447.1 256C447.1 273.7 433.7 288 416 288H109.3l105.4 105.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L109.3 224H416C433.7 224 447.1 238.3 447.1 256z'
    },
    {
        identifier: 'info',
        event: showInfoOverlay,
        viewBox: '0 0 512 512',
        path: 'M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z'
    },
    {
        identifier: 'download',
        event: downloadImage,
        viewBox: '0 0 384 512',
        path: 'M384 128h-128V0L384 128zM256 160H384v304c0 26.51-21.49 48-48 48h-288C21.49 512 0 490.5 0 464v-416C0 21.49 21.49 0 48 0H224l.0039 128C224 145.7 238.3 160 256 160zM255 295L216 334.1V232c0-13.25-10.75-24-24-24S168 218.8 168 232v102.1L128.1 295C124.3 290.3 118.2 288 112 288S99.72 290.3 95.03 295c-9.375 9.375-9.375 24.56 0 33.94l80 80c9.375 9.375 24.56 9.375 33.94 0l80-80c9.375-9.375 9.375-24.56 0-33.94S264.4 285.7 255 295z'
    },
    {
        identifier: 'fullscreen',
        event: toggleFullScreen,
        viewBox: '0 0 448 512',
        path: 'M128 32H32C14.31 32 0 46.31 0 64v96c0 17.69 14.31 32 32 32s32-14.31 32-32V96h64c17.69 0 32-14.31 32-32S145.7 32 128 32zM416 32h-96c-17.69 0-32 14.31-32 32s14.31 32 32 32h64v64c0 17.69 14.31 32 32 32s32-14.31 32-32V64C448 46.31 433.7 32 416 32zM128 416H64v-64c0-17.69-14.31-32-32-32s-32 14.31-32 32v96c0 17.69 14.31 32 32 32h96c17.69 0 32-14.31 32-32S145.7 416 128 416zM416 320c-17.69 0-32 14.31-32 32v64h-64c-17.69 0-32 14.31-32 32s14.31 32 32 32h96c17.69 0 32-14.31 32-32v-96C448 334.3 433.7 320 416 320z'
    }
]

const infoOverlay = document.querySelector('.info-overlay')


function createSVGElement(viewBox, path) {
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    iconSvg.setAttribute('fill', 'currentColor')
    iconSvg.setAttribute('viewBox', viewBox)
    iconPath.setAttribute(
        'd',
        path
    )
    iconSvg.appendChild(iconPath)
    return iconSvg
}

export function createOverlayButtons() {
    buttonsVisibility = false
    const buttonsContainer = document.createElement('div')
    buttonsContainer.classList.add('buttons')
    overlayButtons.forEach(button => {
        const buttonEl = document.createElement('div')
        buttonEl.classList.add(button.identifier, 'button')
        buttonEl.onpointerup = button.event
    
        buttonEl.append(
            createSVGElement(button.viewBox, button.path)
        )
        buttonsContainer.append(buttonEl)
    })
    overlay.append(buttonsContainer)
}


function showInfoOverlay() {
    if(!infoOverlayActive) {
        infoOverlayActive = true
        infoOverlay.style.visibility = 'visible';
        infoOverlay.replaceChildren()
        
    
        for (const key in galleryData[currentIndex].exif) {
            if (Object.hasOwnProperty.call(galleryData[currentIndex].exif, key)) {
    
                const exifType = document.createElement('div')
                exifType.innerText = key
                infoOverlay.append(exifType)
    
                const exifVal = document.createElement('div')
                exifVal.innerText = galleryData[currentIndex].exif[key];
                infoOverlay.append(exifVal)
                
            }
        }
    }
    else hideInfoOverlay()
}

export function hideInfoOverlay() {
    if(infoOverlayActive){
        infoOverlay.style.visibility = 'hidden';
        infoOverlayActive = false
    }
}

function downloadImage() {
    const a = document.createElement('a')
    a.href = `img/orig/${galleryData[currentIndex].path}`
    a.setAttribute('download', galleryData[currentIndex].path)
    a.click()
}

function toggleFullScreen() {
    toggleButtonsVisibility()
    let doc = window.document;
    let docEl = doc.documentElement;

    let requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;
    let cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;

    if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
    ) {
        requestFullScreen.call(docEl);
    } else {
        cancelFullScreen.call(doc);
    }
}


export function toggleButtonsVisibility() {
    if (buttonsVisibility === true) {
        overlay.querySelector('.buttons').style.opacity = '0'
        setTimeout(() => {
            overlay.querySelector('.buttons').style.visibility = 'hidden'
        }, 500);
        buttonsVisibility = false
    } else {
        overlay.querySelector('.buttons').style.visibility = 'visible'
        overlay.querySelector('.buttons').style.opacity = '1'
        buttonsVisibility = true
    }
}
