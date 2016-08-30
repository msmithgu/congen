#!/usr/bin/env node

var _ = require('lodash')
var dateFormat = require('dateformat')
var faker = require('faker')
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
  console.log('*** Processing ' + filepath + '..')

  var dirname = path.dirname(filepath)
  var ext = getCongenExt(filepath)

  fs.readFile(filepath, 'utf8', function(err, template) {
    if (err) {
      console.error('Error reading ' + filepath + ':', err)
    } else {
      var fib = fibSeq()
      var numToGen = 3

      for (var i=0; i<numToGen; i++) {
        var content = genContent(template, fib())
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

function genContent(template, dateOffset) {
  var title = _.capitalize(faker.company.catchPhrase())
  var date = new Date()
  if (dateOffset) {
    date.setDate(date.getDate() - dateOffset)
  }
  var parse = function(template) {
    // Adapted from https://github.com/Marak/faker.js/blob/master/lib/fake.js

    var open = '<{'
    var close = '}>'
    var res = ''

    if (typeof template !== 'string' || template.length === 0) {
      res = 'string parameter is required!'
      return res
    } else {
      // find first matching open and close
      var start = template.search(open)
      var end = template.search(close)

      // if no open and close are found, we are done with this template
      if (start === -1 && end === -1) {
        return template
      }

      // extract method name from between open and close
      var token = template.substr(start + open.length, end - start - close.length);
      var method = _.trim(token.replace(close, '').replace(open, ''))

      var result
      switch(method) {
        case 'title':
          result = faker.company.catchPhrase()
          title = result
          break
        default:
          result = method + '->RESULT'
      }
      res = template.replace(open + token + close, result)

      return parse(res)
    }
  }
  var body = parse(template)

  return {
    title: title,
    date: date,
    body: body
  }
}

main()
