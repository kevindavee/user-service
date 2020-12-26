import { Request, NextFunction, Response } from 'express';
import { CustomError } from 'src/domains';

import { logger } from 'src/libs/logger';
import { HttpStatusErrorCodeMap } from './error-code-map';

export const errorHandler = () => {
  // This is an express error handler, need to the 4 variable signature
  // eslint-disable-next-line
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
      const statusCode = HttpStatusErrorCodeMap[err.errorCode];
      const logContext = {
        error_code: err.errorCode,
        status_code: statusCode,
        context: err.context,
      };

      logger.info(logContext, `API error ${logContext.error_code}`);

      return res.status(statusCode).send({
        error_code: err.errorCode,
        message: err.message,
      });
    }

    logger.error(
      err,
      'SERVER_ERROR',
      {
        body: req.body,
        header: req.header,
      },
    );

    return res.status(500).send({
      error_code: 'INTERNAL_SERVER_ERROR',
      message: 'Something happened on our server :(',
    });
  };
};
