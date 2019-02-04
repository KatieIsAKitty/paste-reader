/* eslint-disable no-console */

'use strict';

const http = require('http');
const { inspect } = require('util');
const { readFile } = require('fs');

function handleConnect(req, res) {
  if (req.url === '/') {
    readFile('./main.html', (html) => {
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
    });
    return;
  }
  console.log(req.url);
  res.setHeader('Content-Type', 'application/json');
  res.end(inspect({ headers: res.getHeaders() }));
}

const server = http.createServer(handleConnect);
server.listen({ port: 8080, host: '127.0.0.1' });
server.on('listening', () => console.log(server.address()));
