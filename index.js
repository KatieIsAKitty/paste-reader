/* eslint-disable no-console */

'use strict';

const { createServer, get } = require('http');
const { readFile, readdir } = require('fs').promises;

const indexPaths = ['/', '/index.js', '', null, 'null', undefined];

const server = createServer(async (req, res) => {
  console.log(req.url);
  const stylePaths = await readdir('./styles/');
  for (let i = 0; i < stylePaths.length; i += 1) {
    stylePaths[i] = `/styles/${stylePaths[i]}`;
  }
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
  if (req.url.startsWith('/https://pastebin.com/') || req.url.startsWith('/pastebin.com/')) {
    const url = req.url.replace(/\/(https:\/\/)?pastebin.com\//i, '');
    get(`http://pastebin.com/raw/${url}`, async (chunks) => {
      let paste = `<html><head><link rel="stylesheet" type="text/css" href="http://${server.address().address}:${server.address().port}/styles/default.css"></head><body>`;
      for await (const chunk of chunks) {
        paste += chunk;
      }
      paste += '</body></html>';
      paste = paste.replace(/[\n\r]+/g, '<br />');
      res.setHeader('Content-Type', 'text/html');
      res.end(paste);
    });
    return;
  }
  res.setHeader('Content-Type', 'application/json');
  res.end('you did a bad, try again');
});

server.listen({ port: 8080, host: '127.0.0.1' });
server.on('listening', () => console.log(server.address()));
