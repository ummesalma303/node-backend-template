import app from '#app.js'
import config from '#config/config.js'
import logger from '#utils/logger.js'
import { Server } from 'http'

const server: Server = app.listen(config.PORT, () => {
    logger.warn({
        meta: {
            PORT: config.PORT
        },
        msg: 'Example app listening on port'
    })

    logger.info({
        meta: {
            PORT: config.PORT,
            SERVER_URL: config.SERVER_URL
        },
        msg: 'APPLICATION_STARTER'
    })
})

server.on('error', (error) => {
    logger.error({
        meta: error,
        msg: 'APPLICATION_ERROR'
    })
    process.exit(1)
})

process.on('SIGINT', () => {
    logger.info({ msg: 'Shutting down server...' })
    server.close(() => process.exit(0))
})
