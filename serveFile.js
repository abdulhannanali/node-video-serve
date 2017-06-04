const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

function encodeFile (headers, acceptEncodings, fileStream) {
  if (acceptEncodings.match(/\bgzip\b/)) {
    headers['content-encoding'] = 'gzip'
    return fileStream.pipe(zlib.createGzip())
  } else if (acceptEncodings.match(/\bdeflate\b/)){
    headers['content-encoding'] = 'deflate'
    return fileStream.pipe(zlib.createDeflate())
  } else {
    return fileStream
  }
}

function serveFile (request, response, filePath) {
  const headers = {}
  const acceptEncodings = request.headers['accept-encoding']
  
  const relativePath = path.join('./', filePath)
  const fileStream = fs.createReadStream(relativePath)

  const encodedFile = encodeFile(headers, acceptEncodings, fileStream)

  response.writeHead(200, headers)
  return encodedFile.pipe(response)
}

module.exports = serveFile