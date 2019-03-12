'use strict';

const conditions = [
  /(https:\/\/)?pastebin.com\//i,
];

const port = 8080;
const host = '127.0.0.1';

module.exports = { conditions, port, host };
