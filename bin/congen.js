#!/usr/bin/env node

var _ = require('lodash')
var dateFormat = require('dateformat')
var fs = require('fs')
var glob = require('glob')
var path = require('path')

function main() {
  processFiles()
}

function processFiles() {
  glob('**/*.congen', function (err, filepaths) {
      if (err) {
        console.error('Error finding congen files: ', err)
      } else {
        _.map(filepaths, function (filepath) {
          processFile(filepath)
        })
      }
  })
}

function processFile(filepath) {
  console.log('Processing ' + filepath + '..')

  var dirname = path.dirname(filepath)
  var ext = getCongenExt(filepath)

  fs.readFile(filepath, 'utf8', function(err, data) {
    if (err) {
      console.error('Error reading ' + filepath + ':', err)
    } else {
      var fib = fibSeq()

      for (var i=0; i<3; i++) {
        var content = genContent(data, fib())
        var basename = formatBasename(content) + ext
        var pathname = path.join(dirname, basename)

        console.log()
        console.log(pathname)
        console.log(content.body)
      }
    }
  })
}

function getCongenExt(filepath) {
  var basename = path.basename(filepath, '.congen')
  return path.extname(basename)
}

function formatBasename(content) {
  var d = dateFormat(content.date, "yyyy-mm-dd")
  var title =
    _.kebabCase(_.join([
      d,
      content.title
    ], '-'))
  return title
}

function genContent(data, dateOffset) {
  var title = 'test title'
  var date = new Date()
  if (dateOffset) {
    date.setDate(date.getDate() - dateOffset)
  }
  var body = data

  return {
    title: title,
    date: date,
    body: body
  }
}

function fibSeq() {
  return (function() {
    var a = 1, b = 1

    return function() {
      var a_old = a
      var b_old = b

      a = b_old
      b = a_old + b_old

      return a
    }
  }())
}

main()
