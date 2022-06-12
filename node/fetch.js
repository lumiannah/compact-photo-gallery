const path = require('./paths.js')

const express = require('express')
const fs = require('fs')
const exif = require('fast-exif')
const helmet = require('helmet')
const app = express()

app.use(helmet())

app.get('/api/files', (request, response) => {
    const files = fs.readdirSync(path.ORIG_FOLDER, { withFileTypes: true })
        .filter(file => !file.isDirectory())
        .map(file => file.name)

    // read exif information from images
    let exifReadRequests = files.map(async (file) => {
        let result = await exif.read(`${path.ORIG_FOLDER}/${file}`)
            .then(exif => {
                const dateTaken = new Date(exif.exif.DateTimeOriginal)
                const unixTimeStamp = Math.floor(dateTaken.getTime() / 1000)
                let simpleExif = {}
                simpleExif.ts = unixTimeStamp
                simpleExif['Date Taken'] = dateTaken.toLocaleString('en-GB')
                simpleExif.Camera = exif.image.Make + ' ' + exif.image.Model.split("\u0000")[0]
                simpleExif['Exposure Time'] = '1 / ' + 1/exif.exif.ExposureTime
                simpleExif.FNumber = exif.exif.FNumber
                simpleExif.ISO = exif.exif.ISO
                simpleExif.ApertureValue = exif.exif.ApertureValue
                simpleExif.FocalLength = exif.exif.FocalLength
                const imgData = {
                    path : file,
                    exif : simpleExif
                }
                return imgData
            })
            .catch(console.error)
        return new Promise((res, rej) => {res(result)})
    })
    
    // only after every file is read then send back the response sorted by date taken
    Promise.all(exifReadRequests).then(results => {
        results.sort((a, b) => b.exif.ts - a.exif.ts)
        results.forEach(image => delete image.exif.ts)
        response.json(results)
    })

})

const PORT = 3002
app.listen(PORT)
