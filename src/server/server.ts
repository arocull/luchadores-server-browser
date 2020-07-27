import express from 'express';
import http from 'http';

import logger from './logger';
import Heartbeat from './heartbeat';

const port = 3500;
const app = express();
const server = http.createServer(app);

// Configure Express
const webRoot = './dist/public';
logger.info(`Web root is ${webRoot}`);
app.use(express.json()); // JSON body parser
app.use(express.static(webRoot)); // Static content handler

// Configure heartbeat handler
const heartbeat = new Heartbeat();
heartbeat.registerEndpoints(app);

server.listen(port);
logger.info(`Server started on port ${port}`);
logger.info(`Go ahead and check out http://localhost:${port}/`);
