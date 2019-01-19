var parseMarkdown = require('./parse.util');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

let outputFile = config.outputFile;
let posts = {};

let postsIn = config.posts;
let callsRemaining = postsIn.length;
for (let i = 0; i < postsIn.length; i++) {
    let filePath = postsIn[i].filePath;
    fs.readFile(filePath, 'utf8', function(err, data) {
        callsRemaining -= 1;
        if (err) {
            return console.log(err);
        }
        posts[postsIn[i].guid] = {
            title: postsIn[i].title,
            body: parseMarkdown(data.split('\r\n')),
            tags: postsIn[i].tags
        };
        if (callsRemaining === 0) {
            fs.writeFile(
                outputFile, 
                `module.exports = ${JSON.stringify(posts)};`,
                function(err) {
                    if (err) {
                        return console.log(err);
                    }
                }
            );
        }
    });
}
