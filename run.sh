#!/usr/bin/env bash
npm install bunyan
npm install oneapm@dev --reg=http://npm.oneapm.com
node ./test/express.js | bunyan