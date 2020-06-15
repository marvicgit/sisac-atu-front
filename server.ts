import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

const server = express();
const distFolder = join(process.cwd(), 'dist/sisac/browser');
const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
server.engine('html', ngExpressEngine({
  bootstrap: AppServerModule,
}));

server.set('view engine', 'html');
server.set('views', distFolder);

  // Example Express Rest API endpoints
  // app.get('/api/**', (req, res) => { });
  // Serve static files from /browser
server.use('/sisac', express.static(distFolder, {
  maxAge: '1y'
}));

  // All regular routes use the Universal engine

server.get('*', (req, res) => {
  res.render('index', { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
});

server.listen(9000, () => {
  console.log(`Node Express server listening on http://localhost:9000`);
});
