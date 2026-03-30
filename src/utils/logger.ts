import config from '#config/config.js'
import { EApplicationEnvironment } from '#constant/application.js'
import dayjs from 'dayjs'
import fs from 'fs'
import path from 'path'
import pino, { type DestinationStream, type LoggerOptions } from 'pino'
import * as rfs from 'rotating-file-stream'
/* ---------------------------- Ensure log directory --------------------------- */
const logDir: string = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })

/* ---------------------------- Environment ---------------------------- */
const isDev: boolean = config.ENV === EApplicationEnvironment.DEVELOPMENT

/* ---------------------------- Rotating File Stream (Prod) ---------------------------- */
const stream: DestinationStream | undefined = !isDev
    ? (rfs.createStream(
          (time: Date | number | undefined) => {
              const date = new Date(time ?? Date.now()).toISOString().slice(0, 10)

              return `${date}-combined.log`
          },
          {
              compress: 'gzip',
              interval: '1d',
              maxFiles: 14,
              path: logDir
          }
      ) as unknown as DestinationStream)
    : undefined

/* ---------------------------- Pino Options ---------------------------- */
const options: LoggerOptions = {
    formatters: {
        level(label: string) {
            return { level: label.toUpperCase() }
        }
    },
    level: isDev ? 'debug' : 'info',
    timestamp: () => {
        const now = dayjs()
        return `,"date ":"${now.format('YYYY-MM-DD')}", "time":"${now.format('HH:mm:ss')}"`
    },
    transport: isDev
        ? {
              options: {
                  colorize: true,
                  ignore: 'pid,hostname',
                  translateTime: 'yyyy-mm-dd HH:MM:ss'
              },
              target: 'pino-pretty'
          }
        : undefined
}

/* ---------------------------- Create Logger ---------------------------- */
const logger = stream ? pino(options, stream) : pino(options)

export default logger
