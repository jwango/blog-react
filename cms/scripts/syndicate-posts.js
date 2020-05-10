const fs = require('fs');
const parse = require('date-fns/parse');
const format = require('date-fns/format');
const compareDesc = require('date-fns/compare_desc');
const RFC822_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss ZZ';

const Metadata = require('../out/metadata.json');
const config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

function readAll() {
  return Metadata.posts.sort((a, b) => compareDesc(a.publishDate, b.publishDate));
}

function* genItem(config, item, levels) {
  yield addIndent('<item>\n', levels);
  yield addIndent(`<guid>${item.guid}</guid>\n`, levels + 1);
  yield addIndent(`<title>${item.title}</title>\n`, levels + 1);
  if (item.authorEmail) {
    yield addIndent(`<author>${item.authorEmail}</author>\n`, levels + 1);
  }
  yield addIndent(`<link>${process.env.PUBLIC_URL}${config.items.baseURL}${item.guid}</link>\n`, levels + 1);
  yield addIndent('<description>\n', levels + 1);
  yield addIndent(`${item.description}\n`, levels + 2);
  yield addIndent('</description>\n', levels + 1);
  for (let tag of (item.tags || [])) {
    yield addIndent(`<category>${tag}</category>\n`, levels + 1);
  }
  yield addIndent(`<pubDate>${format(parse(item.publishDate), RFC822_FORMAT)}</pubDate>\n`, levels + 1);
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

const items = readAll();
if (items) {
  console.table(items.map(item => { 
    return { id: item.guid, title:item.title, pubDate: item.publishDate, author: item.authorEmail };
  }));
  writeToRSS(config, items, () => console.log(`done. written to ${config.outputFile}`));
}
