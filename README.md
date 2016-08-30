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
    categories: congen
    ---

    <{ lorem.paragraphs }>

Then use congen to generate as many as you'd like:

    $ congen g

## License

[ISC](LICENSE)

## References

- http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm
- https://nodejs.org/dist/latest-v4.x/docs/api/
- https://lodash.com/docs
- https://github.com/felixge/node-dateformat
- https://github.com/marak/Faker.js/
- https://github.com/tj/ejs/blob/master/ejs.js
