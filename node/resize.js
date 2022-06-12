const fs = require('fs');
const sharp = require('sharp');


const originalFiles = fs.readdirSync('./img/orig/', { withFileTypes: true })
    .filter(file => !file.isDirectory())
    .map(file => file.name)

const convertedFiles = fs.readdirSync('./img/thumb/', { withFileTypes: true })
    .filter(file => !file.isDirectory())
    .map(file => file.name)


// remove converted orphan files

const orphanFiles = convertedFiles.filter(file => !originalFiles.includes(file))

orphanFiles.forEach(file => {
    try {
        fs.unlinkSync(`./img/thumb/${file}`)
    } catch(err) {
        console.error(err);
    }
    try {
        fs.unlinkSync(`./img/overlay/${file}`)
    } catch(err) {
        console.error(err);
    }
})


// resize unconverted files

const unconvertedFiles = originalFiles.filter(file => !convertedFiles.includes(file))

unconvertedFiles.forEach(file => {
    const originFilePath = './img/orig/' + file
    const thumbFilePath = './img/thumb/' + file
    const overlayFilePath = './img/overlay/' + file

    sharp(originFilePath)
    .resize(480)
    .withMetadata()
    .toFile(thumbFilePath)

    sharp(originFilePath)
    .resize(1920, undefined, {
        withoutEnlargement: true
    })
    .withMetadata()
    .toFile(overlayFilePath)
})


