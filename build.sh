#!/bin/bash
node ./lib/r.js -o name=src/main out=lib/transistor-async.js baseUrl=.
node ./lib/r.js -o name=lib/almond.js include=src/main out=lib/transistor-sync.js baseUrl=.
