import express, { Application } from 'express';
import { expressInit } from './confiigs/expressConfig';
import { port } from './confiigs/index';
import { passportInit } from './confiigs/passport-config';
import { routesInit } from './routes';
import { ConfigService } from './services/config-service';

const app: Application = express();
const configService: ConfigService = new ConfigService();
passportInit(app);
expressInit(app);
routesInit(app);
configService.checkIfQuestionTypesExist().then(() => console.log('config created'));
app.listen(port, () => console.log(`Listening on ${port}`));


