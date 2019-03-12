'use strict';

const { createServer, get } = require('http');
const { readFile, readdir } = require('fs').promises;
const config = require('./config.js').default;

const indexPaths = ['/', '/index.js', '', null, 'null', undefined];

const server = createServer(async (req, res) => {
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
  let url = new URL(req.url, 'http://example.com/').searchParams.get('url');
  if (config.conditions.some((condition) => condition.test(url))) {
    url = url.replace('https:', 'http:');
    get(url, async (chunks) => {
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
  res.setHeader('Content-Type', 'text/html');
  res.end('you did a bad, try again');
});

server.listen({ port: config.port, host: config.host });
server.on('listening', () => console.log(server.address())); // eslint-disable-line no-console
