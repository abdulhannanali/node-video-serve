const http = require('http')
const fs = require('fs')

const serveFile = require('./serveFile')
const serveVideo = require('./serveVideo')

const server = http.createServer()

server.on('request', (req, res) => {
    if (req.url === '/') {
        serveFile(req, res, 'public/index.html')
    } else if (req.url === '/video.mp4') {
        serveVideo(req, res)
    }
})

module.exports = server