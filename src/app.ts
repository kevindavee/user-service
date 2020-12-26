import express, { Application } from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';

export async function createApp(): Promise<Application> {
  const app = express();
  app.set('port', process.env.PORT || 3000);
  app.use(compression());
  app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  return app;
}
