import express, { Application } from 'express';
import { expressInit } from './confiigs/expressConfig';
import { port } from './confiigs/index';
import { passportInit } from './confiigs/passport-config';
import { routesInit } from './routes';

const app: Application = express();

passportInit(app);
expressInit(app);
routesInit(app);

app.listen(port, () => console.log(`Listening on ${port}`));


