/* eslint-disable no-console */

'use strict';

const http = require('http');
const { inspect } = require('util');
const { readFile, readdir } = require('fs').promises;

const indexPaths = ['/', '/index.js', '', null, 'null', undefined];


async function handleConnect(req, res) {
  console.log(req.url);
  const stylePaths = await readdir('./styles/');
  for (let i = 0; i < stylePaths.length; i += 1) {
    console.log(stylePaths[i]);
    stylePaths[i] = `/styles/${stylePaths[i]}`;
  }
  console.log(stylePaths);
  if (indexPaths.includes(req.url)) {
    const html = await readFile('./templates/main.html');
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
    return;
  }
  if (stylePaths.includes(req.url)) {
    const css = await readFile(`.${req.url}`);
    res.setHeader('Content-Type', 'text/css');
    res.end(css);
    return;
  }
  res.setHeader('Content-Type', 'application/json');
  res.end(inspect({ headers: res.getHeaders() }));
}

const server = http.createServer(handleConnect);
server.listen({ port: 8080, host: '127.0.0.1' });
server.on('listening', () => console.log(server.address()));
