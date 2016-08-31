#!/usr/bin/env node

const _ = require('lodash')
const dateFormat = require('dateformat')
const faker = require('faker')
const fs = require('fs')
const glob = require('glob')
const meow = require('meow')
const path = require('path')

const cli = meow(`
  Usage
    $ congen <command>

  Commands
    generate [n]     Generates content files based on congen templates it finds in path
    delete           Deletes any congen generated content files it finds in path

  Options
    --help, -h       Show this help
    --version, -v    Current version of package

  Examples
    $ congen --version
    $ congen generate
    $ congen delete
`, {
  alias: {
    h: 'help',
    v: 'version'
  }
})

function main() {
  if (cli.input.length < 1) {
    displayHelp()
  } else {
    var command = cli.input[0]
    switch (command) {
      case 'generate':
        var numToGen = cli.input[1] || 1
        processFiles(numToGen)
        break
      case 'delete':
        deleteFiles()
        break
      default:
        displayHelp()
    }
  }
}

function displayHelp() {
  console.log(cli.help)
}

function deleteFiles() {
  glob('**/*-_CONGEN.*', function (err, filepaths) {
    if (err) {
      console.error('Error finding congen generated files: ', err)
    } else {
      if (filepaths.length > 0) {
        var plural = (filepaths.length > 1) ? 's' : ''
        console.log('Deleting ' + filepaths.length + ' congen generated file' + plural + '..')
        _.map(filepaths, function (filepath) {
          console.log('    ' + filepath)
          fs.unlinkSync(filepath)
        })
      }
    }
  })
}

function processFiles(numToGen) {
  glob('**/*.congen', function (err, filepaths) {
    if (err) {
      console.error('Error finding congen templates: ', err)
    } else {
      _.map(filepaths, function (filepath) {
        processFile(filepath, numToGen)
      })
    }
  })
}

function processFile(filepath, numToGen) {
  var plural = (numToGen > 1) ? 's' : ''
  console.log('Generating ' + numToGen + ' file' + plural + ' from ' + filepath + '..')

  var dirname = path.dirname(filepath)
  var ext = getCongenExt(filepath)

  fs.readFile(filepath, 'utf8', function(err, template) {
    if (err) {
      console.error('Error reading ' + filepath + ':', err)
    } else {
      var fib = fibSeq()

      for (var i=0; i<numToGen; i++) {
        var content = genContent(template, fib())
        var basename = formatBasename(content) + ext
        var pathname = path.join(dirname, basename)

        console.log('    ' + pathname)
        fs.writeFileSync(pathname, content.body);
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
    ], '-')) + '-_CONGEN'
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

      var methodNameMatch = method.match(/^[^\s]*/)
      var methodName = methodNameMatch ? methodNameMatch[0] : 'NO_METHOD_NAME'

      var methodArgsMatch = method.match(/^[^\s]+\s*(.*)/)
      var methodArgs = methodArgsMatch ? methodArgsMatch[1] : 'NO_METHOD_NAME'

      var result
      switch(methodName) {
        case 'title':
          result = faker.company.catchPhrase()
          title = result
          break
        case 'date':
          result = dateFormat(date, 'yyyy-mm-dd HH:MM:ss o')
          break;
        case 'lorem.paragraphs':
          result = faker.lorem.paragraphs().replace(/\n/g, '\n\n')
          break;
        case 'fake':
          result = faker.fake(methodArgs)
          break;
        default:
          result = ''
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
