import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse, Method } from 'axios';
import { Request } from 'express';

@Injectable()
export class AppService {
  async proxy(baseURL: string, req: Request): Promise<AxiosResponse> {
    return axios({
      url: `${baseURL}${req.originalUrl}`,
      method: req.method as Method,
      data: Object.keys(req.body || {}).length > 0 ? req.body : undefined
    })
  }
}
