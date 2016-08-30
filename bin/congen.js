#!/usr/bin/env node

console.log('congen started...')

var glob = require('glob')

// Find congen files
glob(
  '**/*.congen',
  function (err, files) {
    if (err) {
      console.error('Error finding congen files: ', err)
    } else {
      console.log('Found congen files: ', files)
    }
  }
)
