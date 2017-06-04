const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

const server = require('./index')

server.listen(PORT, HOST, (error) => {
    if (error) {
        throw error
    } else {
        console.log(`
            Server is listening on 
                PORT: ${PORT}
                HOST: ${HOST}
        `)
    }
})