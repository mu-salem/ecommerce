import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `${Date.now()}, request method is : ${req.method}, url is : ${req.originalUrl} from ip : ${req.ip}`,
    );
    next();
  }
}
