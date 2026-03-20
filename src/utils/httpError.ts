import { THttpError } from '#type/types.js'
import { NextFunction, Request } from 'express'

import { errorObjectFunc } from './errorObjects.js'

const httpError = (nextFunc: NextFunction, err: unknown, req: Request, errorStatusCode = 500): void => {
    const errorObj: THttpError = errorObjectFunc(err, req, errorStatusCode)
    nextFunc(errorObj)
}

export { httpError }
