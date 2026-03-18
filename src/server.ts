import app from '#app.js'
import config from '#config/config.js'
import { Server } from 'http'

const server: Server = app.listen(config.PORT, () => {
    console.warn('Example app listening on port', {
        meta: {
            PORT: config.PORT
        }
    })

    console.info('APPLICATION_STARTER', {
        meta: {
            PORT: config.PORT,
            SERVER_URL: config.SERVER_URL
        }
    })
})

server.on('error', (error) => {
    console.error('APPLICATION_ERROR', { meta: error })
    process.exit(1)
})

process.on('SIGINT', () => {
    console.info('Shutting down server...')
    server.close(() => process.exit(0))
})
