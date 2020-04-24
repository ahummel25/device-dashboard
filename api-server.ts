import restify, { Request, Response } from 'restify';
import corsMiddleware from 'restify-cors-middleware';

import deviceReadings from './deviceReadings';

const ipAddress = '127.0.0.1';
const port = '8888';

const { plugins } = restify;

const server = restify.createServer();
server.use(plugins.queryParser());

const cors = corsMiddleware({
  allowHeaders: [],
  exposeHeaders: [],
  preflightMaxAge: 5,
  origins: ['*']
});

server.pre(cors.preflight);
server.use(cors.actual);

const getDeviceReading = (_req: Request, res: Response): void => {
  res.send(200, {
    data: deviceReadings
  });
};

const patchDeviceReading = (
  req: Request,
  res: Response
): Response | null | undefined => {
  if (!req.params.readingName || !req.query.active) {
    res.send(400);
    return;
  }
  try {
    const timeout = Math.floor(Math.random() * 5000);
    const failRate = Math.floor(Math.random() * 100);
    if (failRate > 60) {
      res.send(400, 'device state patch failed');
      return null;
    }
    const targetIndex = deviceReadings.findIndex(
      el => el.name === req.params.readingName
    );
    deviceReadings[targetIndex].active = req.query.active === 'true';
    setTimeout(() => {
      res.send(200, 'OK');
    }, timeout);
  } catch (e) {
    console.log(e);
    res.send(400, e);
  }
};

const PATH = '/devices';
server.get({ path: PATH }, getDeviceReading);
server.patch({ path: `${PATH}/:readingName` }, patchDeviceReading);

server.listen(port, ipAddress, () => {
  console.log('%s listening at %s ', server.name, server.url);
});
