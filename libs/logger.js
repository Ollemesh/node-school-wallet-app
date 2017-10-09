function getDate () {
        const date = new Date();

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        const seconds = date.getSeconds();
        const milliseconds = date.getMilliseconds();

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

'use strict';

const path = require('path');
const log4js = require('log4js');

const filename = path.resolve(__dirname, '..', 'logs', 'app.log');
const config = {
  appenders: {
    out: {type: 'stdout'},
    app: {
      type: 'file',
      filename,
      maxLogSize: 10485760
    }
  },
  categories: {
    default: {
      appenders: ['out', 'app'],
      level: process.env.NODE_ENV === 'DEV' ? 'debug' : 'info'
    }
  }
};

log4js.configure(config);

module.exports = (category) => log4js.getLogger(category);
