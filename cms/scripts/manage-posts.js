const format = require('date-fns/format');
const prompt = require('prompt');
const fs = require('fs').promises;
const sha1 = require('crypto-js/sha1');
const hexEnc = require('crypto-js/enc-hex');
const parseMarkdown = require('./parse.util');
const POSTS_ROOT = './cms/posts/';
const PUBLISHED_PATH = './cms/out/published.json';
const METADATA_PATH = './cms/out/metadata.json';
const CMD_PROMPT = 'Next command';
const POST_PROMPT = 'Which post? (id)';
const SAME_FILE_PROMPT = 'Keep the same file? Y/N';
const FILE_PROMPT = `Which file do you want to use, relative to ${POSTS_ROOT}`;

let publishedMap = {};
let metadata = { posts: [] };

const matchPost = (postId) => (post => post.guid === postId);

function genPostId(content) {
    const numPosts = metadata.posts.length;
    let numChars = 8;
    if (numPosts <= 4000) {
        numChars = 6;
    } else if (numPosts <= 16000) {
        numChars = 7;
    }
    return sha1(content).toString(hexEnc).substring(0, numChars);
}

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

function postExists(postId) {
    return !!publishedMap[postId] && !!metadata.posts.find(matchPost(postId));
}

async function readPost() {
    var postId = (await askCommand(POST_PROMPT))[POST_PROMPT];
    if (!postExists(postId)) {
        throw Error(`cannot find the post with id ${postId} in either published.json or in metadata.json`);
    }
    console.log(`registered to filepath ${publishedMap[postId]}:`)
    console.log(metadata.posts.find(matchPost(postId)));
}

async function publishPost() {
    let currentTime = format(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    let postId = (await askCommand(POST_PROMPT))[POST_PROMPT];
    const isExistingPost = postExists(postId);
    let filepath = isExistingPost ? publishedMap[postId] : '';
    if (isExistingPost) {
        console.log(`Current filepath is set to: ${filepath}.`)
        const useSameFileAnswer = (await askCommand(SAME_FILE_PROMPT))[SAME_FILE_PROMPT];
        if (useSameFileAnswer !== 'Y') {
            filepath = (await askCommand(FILE_PROMPT))[FILE_PROMPT];
        } 
    } else {
        console.log('I see you have a new post. Generating a new post id.');
        filepath = (await askCommand(FILE_PROMPT))[FILE_PROMPT];
    }
    filepath = `${POSTS_ROOT}${filepath}`;

    // read metadata from file
    const filecontent = await fs.readFile(filepath, 'utf-8');
    const filemeta = parseMarkdown(filecontent.split('\r\n')).metadata;
    if (!isExistingPost) {
        let i = 0;
        do {
            postId = genPostId(filecontent + currentTime + i);
            i += 1;
        } while (postExists(postId));
        console.log(`${i - 1} collisions in generating new post id`);
    }

    publishedMap[postId] = filepath;
    const newMetadata = {
        guid: postId,
        author: filemeta.author,
        title: filemeta.title,
        description: filemeta.description,
        tags: filemeta.tags.split(',').map(item => item.trim()),
        lastUpdateDate: currentTime
    };
    const index = metadata.posts.findIndex(matchPost(postId));
    if (index >= 0) {
        metadata.posts[index] = {
            ...newMetadata,
            publishDate: (metadata.posts[index] && metadata.posts[index].publishDate) || currentTime
        };
    } else {
        metadata.posts.push({
            ...newMetadata,
            publishDate: currentTime
        });
    }
    console.log(`post with id ${postId} has been marked for publication. run save command to commit all changes`);
}

async function deletePost() {
    var postId = (await askCommand(POST_PROMPT))[POST_PROMPT];
    if (!postExists(postId)) {
        throw Error(`post with id ${postId} does not exist`);
    }
    publishedMap[postId] = undefined;
    const index = metadata.posts.findIndex(matchPost(postId));
    metadata.posts.splice(index, 1);
    console.log(`post with id ${postId} has been marked for delete. run save command to commit all changes`)
}

async function listAll() {
    console.table(metadata.posts.map(item => {
        return { guid: item.guid, title: item.title };
    }));
}

async function saveAll() {
    console.log('committing the filepaths...');
    await fs.writeFile(PUBLISHED_PATH, JSON.stringify(publishedMap, null, 2));
    console.log('committing the metadata...');
    await fs.writeFile(METADATA_PATH, JSON.stringify(metadata, null, 2));
    console.log('saved!');
}

prompt.start();
Promise.all([fs.readFile(PUBLISHED_PATH, 'utf-8'), fs.readFile(METADATA_PATH, 'utf-8')])
    .then(async ([publishedMapRaw, metadataRaw]) => {
        publishedMap = JSON.parse(publishedMapRaw);
        metadata = JSON.parse(metadataRaw);
        console.log("existing posts loaded");
        var closing = false;
        while (!closing) {
            try {
                var cmdRes = await askCommand(CMD_PROMPT);
                var cmd = cmdRes[CMD_PROMPT].trim().toLowerCase();
                if (cmd === 'list') {
                    await listAll();
                } else if (cmd === 'read') {
                    await readPost();
                } else if (cmd === 'publish') {
                    await publishPost();
                } else if (cmd === 'delete') {
                    await deletePost();
                } else if (cmd === 'save') {
                    await saveAll();
                } else if (cmd === 'exit') {
                   closing = true;
                }
            } catch (err) {
                console.log(err);
            }
        }
    });