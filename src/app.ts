import express, { Application } from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import { IController, init } from './init';
import { errorHandler } from './controllers/middlewares/error-handler';

async function setupRoutes(app: Application) {
  const controllers = await init();
  controllers.forEach((controller: IController) => controller.install(app));
}

export async function createApp(): Promise<Application> {
  const app = express();
  app.set('port', process.env.PORT || 3000);
  app.use(compression());
  app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  await setupRoutes(app);

  app.use(errorHandler());

  return app;
}
