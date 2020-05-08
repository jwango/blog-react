var BLOG_POSTS = require('../data');
var format = require('date-fns/format');
var prompt = require('prompt');
var MongoClient = require('mongodb').MongoClient;
var DB = process.env.MONGODB_DB || 'blog-react';
var URL = process.env.MONGODB_URI || 'mongodb://localhost:27017';
var COLLECTION = 'posts';
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
    return client.db(DB).collection(COLLECTION);
}

async function readPost(client) {
    var postId = (await askCommand(POST_PROMPT))[POST_PROMPT];
    var postsCollection = getBlogCollection(client);
    var cursor = postsCollection.find({ _id: postId });
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
        var postsCollection = getBlogCollection(client);
        var post = BLOG_POSTS[postId];
        var docToWrite = {
            _id: postId,
            guid: post.guid,
            title: post.title,
            description: post.description,
            body: post.body,
            tags: post.tags.map((tag) => tag.replace(/ /g, '')),
            lastUpdateDate: currentTime
        };
        postsCollection.updateOne(
            { _id: postId },
            { $set: docToWrite, $setOnInsert: { publishDate: currentTime} },
            { upsert: true }
        ).then(console.log, console.log);
    }
}

async function deletePost(client) {
    var postId = (await askCommand(POST_PROMPT))[POST_PROMPT];
    var postsCollection = getBlogCollection(client);
    postsCollection.deleteOne(
        { _id: postId }
    ).then(console.log, console.log);
}

async function dropCollection(client) {
    var collection = client.db(DB).collection(COLLECTION);
    collection.drop().then(console.log, console.log);
}

async function createCollection(client) {
    client.db(DB).createCollection(COLLECTION).then(console.log, console.log);
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
                } else if (cmd === 'drop') {
                    await dropCollection(client);
                } else if (cmd === 'create') {
                    await createCollection(client);
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