const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const parse = require('date-fns/parse');
const format = require('date-fns/format');
const RFC822_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss ZZ';

const config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

process.env.MONGODB_DB = process.env.MONGODB_DB || 'blog-react';
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
process.env.PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3000";

async function readLatest(client, limit) {
  const postsCollection = client.db(process.env.MONGODB_DB).collection("posts");
  const cursor = postsCollection.find().sort({ lastUpdateDate: -1 }).limit(limit);
  let completed = 0;
  let count = 0;
  let docs = [];
  while (!cursor.isClosed()) {
      try {
          if (await cursor.hasNext()) {
              count += 1;
              cursor.next()
                .then((doc) => {
                    completed += 1;
                    docs.push(doc);
                })
                .catch((err) => console.log(err));
          } else if (completed === count) {
              cursor.close();
          }
      } catch (error) {
          console.log(error);
          cursor.close();
      }
  }
  return docs;
}

function* genItem(config, item, levels) {
  yield addIndent('<item>\n', levels);
  yield addIndent(`<guid>${item.guid}</guid>\n`, levels + 1);
  yield addIndent(`<title>${item.title}</title>\n`, levels + 1);
  yield addIndent(`<link>${process.env.PUBLIC_URL}${config.items.baseURL}${item._id}</link>\n`, levels + 1);
  yield addIndent('<description>\n', levels + 1);
  yield addIndent(`${item.description}\n`, levels + 2);
  yield addIndent('</description>\n', levels + 1);
  for (let tag of (item.tags || [])) {
    yield addIndent(`<category>${tag}</category>\n`, levels + 1);
  }
  yield addIndent(`<pubDate>${format(parse(item.lastUpdateDate), RFC822_FORMAT)}</pubDate>\n`, levels + 1);
  yield addIndent('</item>\n', levels);
}

function* genItems(config, items) {
  yield '<rss version="2.0">\n';
  yield addIndent('<channel>\n', 1);
  yield addIndent(`<title>${config.channel.title}</title>\n`, 2);
  yield addIndent(`<link>${process.env.PUBLIC_URL}</link>\n`, 2);
  yield addIndent('<description>\n', 2);
  yield addIndent(`${config.channel.description}\n`, 3);
  yield addIndent('</description>\n', 2);
  yield addIndent(`<pubDate>${format(parse(new Date()), RFC822_FORMAT)}</pubDate>\n`, 2);
  for (let item of items) {
    yield* genItem(config, item, 2);
  }
  yield addIndent('</channel>\n', 1);
  yield '</rss>';
}

function writeToRSS(config, items, callback) {
  const ws = fs.createWriteStream(config.outputFile);
  const it = genItems(config, items);
  write(ws, it, 'utf8', callback);
}

function write(ws, it, encoding, callback) {
  const ok = true;
  let val = it.next().value;
  let nextVal = undefined;
  do {
    nextVal = it.next().value;
    if (val && !nextVal) {
      ws.write(val, encoding, callback);
    } else if (val) {
      ws.write(val, encoding);
    } else {
      callback(new Error('nothing to iterate over'));
    }
    val = nextVal;
  } while (val && ok);
  if (val) {
    ws.once('drain', () => write(ws, it, encoding, callback));
  } else {
    ws.end();
  }
}

function addIndent(line, levels) {
  let indent = '';
  for (let i = 0; i < levels; i ++) {
    indent += '  ';
  }
  return indent + line;
}

/*MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(async (client) => {
    const items = await readLatest(client, 15);
    if (items) {
      items.forEach((item) => {
        console.log(`${item._id}: ${item.lastUpdateDate}`);
      });
      writeToRSS(config, items, () => client.close());
    } else {
      client.close();
    }
  }, (reason) => {
    console.log(reason);
  });*/
console.log("TODO: re-implement with metadata.json");
