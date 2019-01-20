var BLOG_POSTS = require('../data');
var format = require('date-fns/format');
var prompt = require('prompt');
var MongoClient = require('mongodb').MongoClient;
var URL = "mongodb://localhost:27017";
var CMD_PROMPT = 'Next command';
var POST_PROMPT = 'Which post? (id)';

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

async function readPost(client) {
    var postId = (await askCommand(POST_PROMPT))[POST_PROMPT];
    var foo = getBlogCollection(client);
    var cursor = foo.find({ _id: postId });
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

async function uploadPost(client) {
    let currentTime = format(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    var postId = (await askCommand(POST_PROMPT))[POST_PROMPT];
    if (BLOG_POSTS[postId]) {
        console.log(`Uploading post ${postId}...`);
        var foo = getBlogCollection(client);
        var docToWrite = Object.assign({ _id: postId, lastUpdateDate: currentTime }, BLOG_POSTS[postId]);
        foo.updateOne(
            { _id: postId },
            { $set: docToWrite, $setOnInsert: { publishDate: currentTime} },
            { upsert: true }
        ).then((val) => console.log(val), (err) => console.log(err));
    }
}

async function deletePost(client) {
    var postId = (await askCommand(POST_PROMPT))[POST_PROMPT];
    var foo = getBlogCollection(client);
    foo.deleteOne(
        { _id: postId }
    ).then((val) => console.log(val), (err) => console.log(err));
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
                    await readPost(client);
                } else if (cmd === 'upload') {
                    await uploadPost(client);
                } else if (cmd === 'delete') {
                    await deletePost(client);
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