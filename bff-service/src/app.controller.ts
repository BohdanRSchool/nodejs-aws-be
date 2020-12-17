import { All, CACHE_MANAGER, Controller, Inject, Req, Res, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { Cache } from 'cache-manager';

@Controller('*')
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly appService: AppService,
  ) { }

  private readonly logger = new Logger(AppController.name);

  @All()
  async proxy(@Req() req: Request, @Res() res: Response) {
    try {
      const recipient = req.originalUrl.split('/');
      const baseUrl = this.configService.get(recipient[recipient.length - 1]);
      if (!baseUrl) {
        return res.status(502).send({ message: 'Cannot process request' });
      }

      const isCacheableRequest = req.method.toUpperCase() === 'GET' && /^\/products\/?$/.test(req.originalUrl.split('?')[0]);
      if (isCacheableRequest) {
        const cachedResponse = await this.cacheManager.get(req.originalUrl);

        if (cachedResponse) {
          return res
            .status(200)
            .set('X-Cache', 'HIT')
            .send(cachedResponse);
        }
      }

      const serviceResponse = await this.appService.proxy(baseUrl, req);

      res.status(serviceResponse.status).send(serviceResponse.data);

      if (isCacheableRequest) {
        await this.cacheManager.set(
          req.originalUrl,
          serviceResponse.data,
          { ttl: 120 }
        ).catch((err) => this.logger.error(err.message));
      }
    } catch (err) {
      if (err.response) {
        return res.status(err.response.status).send(err.response.data);
      }

      return res.status(500).send({ message: err.message });
    }
  }
}
