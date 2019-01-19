var BLOG_POSTS = require('../data');

var prompt = require('prompt');
var MongoClient = require('mongodb').MongoClient;
var URL = "mongodb://localhost:27017";
var CMD_PROMPT = 'Next command';
var POST_PROMPT = 'Which post to upload? (id)';

function askCommand(ask) {
    return new Promise((resolve, reject) => {
        prompt.get([ask], function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function getBlogCollection(client) {
    return client.db("test").collection("foo");
}

async function read(client) {
    var foo = getBlogCollection(client);
    var cursor = foo.find({});
    var completed = 0;
    var count = 0;
    while (!cursor.isClosed()) {
        try {
            if (await cursor.hasNext()) {
                count += 1;
                cursor.next()
                    .then((doc) => {
                        console.log(JSON.stringify(doc));
                        completed += 1;
                    })
                    .catch((err) => console.log(err));
            } else if (completed === count) {
                cursor.close();
            }
        } catch (error) {
            console.log(error);
        }
    }
}

async function upload(client) {
    var postRes = await askCommand(POST_PROMPT);
    var postId = postRes[POST_PROMPT];
    if (BLOG_POSTS[postId]) {
        console.log(`Uploading post ${postId}...`);
        var foo = getBlogCollection(client);
        var docToWrite = Object.assign({ _id: postId }, BLOG_POSTS[postId]);
        foo.updateOne({ _id: postId }, { $set: docToWrite }, { upsert: true })
            .then((val) => console.log(val), (err) => console.log(err));
    }
}

prompt.start();
MongoClient.connect(URL,  { useNewUrlParser: true })
    .then(async (client) => {
        console.log("connected successfully to the server");
        var closing = false;
        while (client.isConnected && !closing) {
            try {
                var cmdRes = await askCommand(CMD_PROMPT);
                var cmd = cmdRes[CMD_PROMPT].trim().toLowerCase();
                if (cmd === 'read') {
                    await read(client);
                } else if (cmd === 'upload') {
                    await upload(client);
                } else if (cmd === 'exit') {
                    console.log("closing...");
                    closing = true;
                    client.close()
                        .catch((err) => {
                            console.log(err);
                            closing = false;
                        });
                }
            } catch (err) {
                console.log(err);
            }
        }
    });