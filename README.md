# congen

Template based content generator

## Install

    npm install --global congen

## Example usage

Make a congen template file called **_posts/_post.md.congen** with the following contents:

    ---
    layout: post
    title:  <{ title }>
    date:   <{ date }>
    author: <{ fake {{name.lastName}}, {{name.firstName}} {{name.suffix}} }>
    categories: congen
    ---

    <{ lorem.paragraphs }>

Then use congen to generate as many as you'd like:

    $ congen generate

## Usage References

- https://github.com/marak/Faker.js/

## Dev References

- http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm
- https://nodejs.org/dist/latest-v4.x/docs/api/
- https://lodash.com/docs
- https://github.com/felixge/node-dateformat
- https://github.com/marak/Faker.js/
- https://github.com/tj/ejs/blob/master/ejs.js

## License

Copyright (c) 2016 Mark Smith-Guerrero <msmithgu@gmail.com>

Licensed under the [ISC](LICENSE) License.
