/**
 * Serves the video in chunks to the user,
 * so the user, can play Video On Demand with 
 * customizable seeking
 * 
 * Implemented in NodeJS
 */
const fs = require('fs')
const path = require('path')
const config = require('./config')
const MAX_CHUNK = 1024 * 1024

const videoPath = path.join(config.FILE_ABSOLUTE_PATH, config.VIDEOS.CHARLIE_CHOCOLATE)
const fileStats = fs.statSync(videoPath)

function serveVideo (request, response) {
    const { range } = request.headers

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const partialstart = parts[0]
        const partialend = parts[1]

        const start = parseInt(partialstart, 10)
        let end = partialend ? parseInt(partialend, 10) : fileStats.size - 1
        let chunksize = end - start + 1
        if (chunksize > MAX_CHUNK) {
            end = start + MAX_CHUNK - 1
            chunksize = (end - start) + 1
        }

        const bytesString = `bytes  ${start}-${end}/${fileStats.size}`
        response.writeHead(206, {
            'Content-Range': bytesString, 
            'Accept-Ranges': 'bytes', 
            'Content-Length': chunksize,
            'Content-Type': 'application/mp4'
        })

        return fs.createReadStream(videoPath, { start: start, end: end, autoClose: true }).pipe(response)
    } else {
        response.writeHead(404)
        response.write('Not Found')
        response.end()
    }
}


module.exports = serveVideo