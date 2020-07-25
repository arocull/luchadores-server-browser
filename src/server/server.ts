import express from 'express';
import http from 'http';

const port = 3500;
const app = express();
const server = http.createServer(app);

const webRoot = './dist/public';
console.log(`Web root is ${webRoot}`);
app.use(express.static(webRoot));

server.listen(port);
console.log(`Server started on port ${port}`);
console.log(`Go ahead and check out http://localhost:${port}/`);
