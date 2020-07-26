import express from 'express';
import http from 'http';

import logger from './logger';
import Heartbeat from './heartbeat';

const port = 3500;
const app = express();
const server = http.createServer(app);

const webRoot = './dist/public';
logger.info(`Web root is ${webRoot}`);

app.use(express.json());
app.use(express.static(webRoot));

// Configure heartbeat handler
const heartbeat = new Heartbeat();
heartbeat.handler(app);

server.listen(port);
logger.info(`Server started on port ${port}`);
logger.info(`Go ahead and check out http://localhost:${port}/`);
