const THEMATIC_BREAK_CHARS = ['*', '-', '_'];
const SETEXT_CHARS = ['=', '-'];
const NODE_KIND = {
    STRING: '',
    BOLD: '**',
    BLANK: '',
    BLOCKQUOTE: '>',
    BREAK: 'br',
    CODE_INLINE: '`',
    CODE_FENCE: '```',
    HEADING: [
        '#',
        '##',
        '###',
        '####',
        '#####',
        '#######',
    ],
    IMAGE: 'img',
    ITALICS: '*',
    LINK: '[]',
    LIST_ITEM: 'li',
    LIST_ORDERED: 'ol',
    LIST_UNORDERED: 'ul',
    PARAGRAPH: 'p',
    STRIKE: '~',
    THEMATIC_BREAK: 'hr'
}

function hasSetext(line) {
    let has = false;
    let i = 0;
    let which = 0;
    while (i < SETEXT_CHARS.length && !has) {
        let setextChar = SETEXT_CHARS[i];
        has = line.search(new RegExp(`^[ ]{0,3}[${setextChar}]{3,}`)) >= 0;
        which += 1;
        i += 1;
    }
    return has ? which : 0;
}

function hasThematicBreakFor(line) {
    let has = false;
    let i = 0;
    while (i < THEMATIC_BREAK_CHARS.length && !has) {
        let breakChar = THEMATIC_BREAK_CHARS[i];
        has = line.search(new RegExp(`^[ ]{0,3}([${breakChar}][ ]*){3,}$`)) >= 0;
        i += 1;
    }
    return has;
}

function getHeaderATX(line) {
    let matches = line.match(/^[ ]{0,3}[#]{1,6}[ ](.*)$/);
    if (matches && matches.length > 1) {
        return {
            inline: matches[1],
            level: line.match(/^[ ]{0,3}[#]{1,6}/g)[0].length
        };
    }
    return undefined;
}

function getImageDef(line) {
    let matches = line.match(/^[ ]{0,3}!\[(.+)\]:[ ]*([^ \r\n]+)[ ]*(.*)/);
    if (matches && matches.length > 2) {
        return {
            key: matches[1],
            url: matches[2],
            alt: matches[3]
        };
    }
    return undefined;
}

function getLinkDef(line) {
    let matches = line.match(/^[ ]{0,3}\[(.+)\]:[ ]*([^ \r\n]+)[ ]*(.*)/);
    if (matches && matches.length > 2) {
        return {
            key: matches[1],
            url: matches[2],
            title: matches[3]
        };
    }
    return undefined;
}

function getCodeFence(line) {
    let matches = line.match(/^([ ]{0,3})(`{3,})(.*)$/);
    if (matches && matches.length > 2) {
        return {
            indentation: matches[1].length,
            n: matches[2].length,
            info: matches[3] ? matches[3].trim() : ''
        };
    }
    return undefined;
}

function getBlockquote(line) {
    let matches = line.match(/^[ ]{0,3}>[ ]{0,1}(.*)$/);
    if (matches) {
        return matches.length > 0 ? matches[1] : '';
    }
    return undefined;
}

function getListmarker(line) {
    let matches = line.match(/^([ ]*)([-+*])([ ]{1,4})(.*)$/);
    if (matches && matches.length > 4) {
        let content = matches[4];
        if (content && content !== '') {
            return {
                kind: NODE_KIND.LIST_UNORDERED,
                symbol: matches[2],
                indentation: matches[1].length,
                w: 1,
                n: matches[3].length,
                inline: content
            }
        }
    }

    matches = line.match(/^^([ ]*)([0-9]{1,9})([.)])([ ]{1,4})(.*)$/);
    if (matches && matches.length > 5) {
        let content = matches[5];
        if (content && content !== '') {
            return {
                kind: NODE_KIND.LIST_ORDERED,
                symbol: matches[3],
                indentation: matches[1].length,
                w: matches[2].length,
                n: matches[4].length,
                start: matches[2],
                inline: content
            }
        }
    }

    return undefined;
}

function unindent(line, indentation) {
    if (!line || !line.length) {
        return line;
    }
    let i = 0, currChar = ' ';
    while (i < line.length && i <= indentation && currChar === ' ') {
        currChar = line[i];
        i += 1;
    }
    return line.slice(i - 1);
}

function getLast(arr) {
    if (arr && arr.length > 0) {
        return arr[arr.length - 1];
    }
    return undefined;
}

function insertSibling(nodes, sibling) {
    let i = 0;
    let currNode = nodes[i];
    let found = false;
    let left = '';
    let right = '';
    let newNodes = [];
    let splitNode = undefined;
    while (i < nodes.length && !found) {
        if (sibling.start >= currNode.start && sibling.end <= currNode.end) {
            found = true;
            left = currNode.content.slice(0, sibling.start - currNode.start);
            right = currNode.content.slice(currNode.content.length + sibling.end - currNode.end);
            splitNode = currNode;
        } else {
            newNodes.push(currNode);
        }
        i += 1;
        currNode = nodes[i];
    }
    if (found) {
        if (left !== '') {
            newNodes.push({
                kind: NODE_KIND.STRING,
                start: splitNode.start,
                end: sibling.start - 1,
                content: left
            });
        }
        newNodes.push(sibling);
        if (right !== '') {
            newNodes.push({
                kind: NODE_KIND.STRING,
                start: sibling.end + 1,
                end: splitNode.end,
                content: right
            });
        }
    }
    return newNodes;
}

function parseSplit(line, delimNode, criteria) {
    let nodes = [];
    line.split(criteria).forEach((val, i, arr) => {
        if (val !== '') {
            nodes.push({
                kind: NODE_KIND.STRING,
                content: val
            });
        }
        if (i !== arr.length - 1) {
            nodes.push(delimNode);
        }
    })
    if (nodes.length === 0) {
        nodes.push({
            kind: NODE_KIND.STRING,
            content: line
        })
    }
    return nodes;
}

function parseGroup(line, targetSymbol, targetKind, depth) {
    let symbolStack = [];
    let nodes = [{
        kind: NODE_KIND.STRING,
        start: 0,
        end: line.length - 1,
        content: line
    }];
    for (let i = 0; i < line.length; i += 1) {
        let symbol = line[i];
        let prevSymbol = undefined;
        if (symbolStack.length > 0) {
            prevSymbol = symbolStack.pop();
        }
        if (symbol === targetSymbol) {
            if (!prevSymbol || prevSymbol.val !== symbol || prevSymbol.pos + 1 === i) {
                symbolStack.push(prevSymbol);
                symbolStack.push({
                    val: symbol,
                    pos: i
                });
            } else {
                let level = 0;
                let tempSymbol = prevSymbol;
                while (symbolStack.length > 0 && level < depth && tempSymbol.val === line[i + level]) {
                    prevSymbol = tempSymbol;
                    tempSymbol = symbolStack.pop();
                    level += 1;
                }
                let start = prevSymbol.pos;
                let end = i + level - 1;
                let sibling = {
                    kind: targetKind,
                    start: start,
                    end: end,
                    content: line.slice(start + 1, end)
                };
                nodes = insertSibling(nodes, sibling);
            }
        } else if (prevSymbol) {
            symbolStack.push(prevSymbol);
        }
    }
    return nodes;
}

function parseNodes(nodes, parseFn) {
    let newNodes = [];
    for (let node of nodes) {
        if (node.kind === NODE_KIND.STRING) {
            newNodes = newNodes.concat(parseFn(node));
        } else {
            newNodes.push(node);
        }
    }
    return newNodes;
}

function parseInline(line, linkDefinitions, imageDefinitions) {
    line = line ? line : '';
    // parse the content here
    let nodes = [{
        kind: NODE_KIND.STRING,
        start: 0,
        end: line.length - 1,
        content: line
    }];

    // Parse recursive blocks
    let parseOrder = [
        {
            kind: NODE_KIND.ITALICS,
            symbol: '*',
            depth: 3
        },
        {
            kind: NODE_KIND.STRIKE,
            symbol: '~',
            depth: 1
        },
        {
            kind: NODE_KIND.CODE_INLINE,
            symbol: '`',
            depth: 1
        }
    ];
    while (parseOrder.length > 0) {
        let parseTarget = parseOrder.pop();
        nodes = parseNodes(nodes, (node) => parseGroup(node.content, parseTarget.symbol, parseTarget.kind, parseTarget.depth));
    }

    // parse image definitions
    for (let imageDef of imageDefinitions) {
        nodes = parseNodes(nodes, (node) => {
            return parseSplit(
                node.content,
                {
                    kind: NODE_KIND.IMAGE,
                    meta: {
                        src: imageDef.url,
                        alt: imageDef.alt
                    }
                },
                new RegExp(`!\\[${imageDef.key}\\]`)
            );
        });
    }

    // parse link definitions
    for (let linkDef of linkDefinitions) {
        nodes = parseNodes(nodes, (node) => {
            return parseSplit(
                node.content,
                {
                    kind: NODE_KIND.LINK,
                    content: linkDef.key,
                    meta: {
                        url: linkDef.url,
                        title: linkDef.title
                    }
                },
                new RegExp(`\\[${linkDef.key}\\]`)
            );
        });
    }

    // parse auto links
    nodes = parseNodes(nodes, (node) => {
        let autoLinks = node.content.match(/<[\w+\-.]{2,32}:.*?>/g);
        if (!autoLinks) {
            autoLinks = [];
        } else {
            autoLinks = autoLinks.map((val) => val.slice(1,-1));
        }
        let internalNodes = [node];
        for (let autoLink of autoLinks) {
            internalNodes = parseNodes(internalNodes, (internalNode) => {
                return parseSplit(
                    internalNode.content,
                    {
                        kind: NODE_KIND.LINK,
                        content: autoLink,
                        meta: {
                            url: autoLink
                        }
                    },
                    new RegExp(`\\<${autoLink}\\>`)
                );
            });
        }
        return internalNodes;
    });

    // parse line breaks
    nodes = parseNodes(nodes, (node) => {
        return parseSplit(
            node.content,
            {
                kind: NODE_KIND.BREAK
            },
            '\\\n'
        );
    });

    for (let node of nodes) {
        node.start = undefined;
        node.end = undefined;
        let parseInner = false;
        if (node.kind === NODE_KIND.ITALICS) {
            if (node.content.length > 1 && node.content[0] === '*' && node.content[node.content.length - 1] === '*') {
                node.kind = NODE_KIND.BOLD;
                node.content = node.content.slice(1, -1);
            }
            parseInner = true;
        } else if (node.kind === NODE_KIND.STRIKE) {
            parseInner = true
        }

        if (parseInner) {
            let innerNodes = parseInline(node.content, linkDefinitions, imageDefinitions);
            if (innerNodes.length > 1 || innerNodes[0].kind !== NODE_KIND.STRING) {
                node.children = innerNodes;
                node.content = undefined;
            }
        }
    }
    return nodes;
}

function parseBlock(block, linkDefinitions, imageDefinitions) {
    let currNode = {
        kind: block.kind,
        meta: block.meta
    };
    if (block.children) {
        currNode.children = [];
        for (let childBlock of block.children) {
            currNode.children.push(parseBlock(childBlock, linkDefinitions, imageDefinitions));
        }
    } else {
        let nodes = parseInline(block.inline, linkDefinitions, imageDefinitions);
        if (nodes.length === 1 && nodes[0].kind === NODE_KIND.STRING) {
            currNode.content = nodes[0].content;
        } else {
            currNode.children = nodes;
        }
    }
    return currNode;
}

function parseLines(lines, defaultSymbol) {
    let blocks = [];
    let prevBlock = undefined;
    let linkDefinitions = [];
    let imageDefinitions = [];
    let codeFenceMeta = {
        active: false,
        indentation: 0,
        n: 0,
        block: {}
    };
    let listMeta = {
        active: false,
        symbol: undefined,
        block: {},
        blanks: 0
    }
    let containerBlocks = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // parse leaf blocks 
        let setextType = hasSetext(line);
        let headerATX = getHeaderATX(line);
        let linkDef = getLinkDef(line);
        let imageDef = getImageDef(line);
        let blockquote = getBlockquote(line);
        let codeFence = getCodeFence(line);
        let listMarker = getListmarker(line);

        if (codeFenceMeta.active) {
            if (codeFence && codeFence.n >= codeFenceMeta.n) {
                codeFenceMeta.active = false;
                codeFenceMeta.n = 0;
            } else {
                let indentedLine = unindent(line, codeFenceMeta.indentation);
                let sep = codeFenceMeta.block.inline === '' ? '' : '\n';
                codeFenceMeta.block.inline += `${sep}${indentedLine}`;
            }
        }  else if (listMarker) {
            let createNewblock = false;
            if (listMeta.active) {
                listMeta.blanks = 0;
                if (listMeta.block.indentation < listMarker.indentation) {
                    let lastItemBlock = getLast(listMeta.block.children);
                    lastItemBlock.innerLines.push(unindent(line, listMeta.block.indentation));
                } else if (listMeta.symbol === listMarker.symbol) {
                    let listItemBlock = {
                        kind: NODE_KIND.LIST_ITEM,
                        innerLines: [listMarker.inline]
                    };
                    listMeta.block.children.push(listItemBlock);
                    containerBlocks.push(listItemBlock);
                } else {
                    createNewblock = true;
                }
            } else {
                createNewblock = true;
            }

            if (createNewblock) {
                let listItemBlock = {
                    kind: NODE_KIND.LIST_ITEM,
                    innerLines: [listMarker.inline]
                };
                let listBlock = {
                    kind: listMarker.kind,
                    w: listMarker.w,
                    n: listMarker.n,
                    align: listMarker.w + listMarker.n,
                    indentation: listMarker.indentation,
                    children: [listItemBlock]
                };
                if (listMarker.kind === NODE_KIND.LIST_ORDERED) {
                    listBlock.meta = {
                        start: listMarker.start
                    };
                }
                listMeta.symbol = listMarker.symbol;
                listMeta.active = true;
                listMeta.blanks = 0;
                listMeta.block = listBlock;
                blocks.push(listBlock);
                containerBlocks.push(listItemBlock);
            }
        } else if (line.trim() === '') {
            if (listMeta.active) {
                listMeta.blanks += 1;
                if (listMeta.blanks < 2) {
                    let lastItemBlock = getLast(listMeta.block.children);
                    lastItemBlock.innerLines.push('');
                } else {
                    listMeta.active = false;
                    listMeta.blanks = 0;
                    blocks.push({
                        kind: NODE_KIND.BLANK
                    });
                }
            } else {
                blocks.push({
                    kind: NODE_KIND.BLANK
                });
            }
        } else if (listMeta.active) {
            listMeta.blanks = 0;
            let lastItemBlock = getLast(listMeta.block.children);
            lastItemBlock.innerLines.push(unindent(line, listMeta.block.indentation));
        } else if (setextType) {
            prevBlock.kind = NODE_KIND.HEADING[setextType - 1];
        } else if (hasThematicBreakFor(line)) {
            blocks.push({
                kind: NODE_KIND.THEMATIC_BREAK
            });
        } else if (headerATX) {
            blocks.push({
                kind: NODE_KIND.HEADING[headerATX.level - 1],
                inline: headerATX.inline
            });
        } else if (linkDef && (!prevBlock || prevBlock.kind === NODE_KIND.BLANK)) {
            linkDefinitions.push(linkDef);
        } else if (imageDef && (!prevBlock || prevBlock.kind === NODE_KIND.BLANK)) {
            imageDefinitions.push(imageDef);
        } else if (blockquote || blockquote === '') {
            if (prevBlock && prevBlock.kind === NODE_KIND.BLOCKQUOTE) {
                prevBlock.innerLines.push(blockquote);
            } else {
                let containerBlock = {
                    kind: NODE_KIND.BLOCKQUOTE,
                    innerLines: [blockquote]
                };
                blocks.push(containerBlock);
                containerBlocks.push(containerBlock);
            }
        } else if (codeFence) {
            codeFenceMeta.block = {
                kind: NODE_KIND.CODE_FENCE,
                inline: '',
                meta: {
                    info: codeFence.info
                }
            };
            codeFenceMeta.active = true;
            codeFenceMeta.indentation = codeFence.indentation;
            codeFenceMeta.n = codeFence.n;
            blocks.push(codeFenceMeta.block);
        } else {
            if (prevBlock && prevBlock.kind === defaultSymbol) {
                prevBlock.inline = `${prevBlock.inline}\n${line}`;
            } else {
                blocks.push({
                    kind: defaultSymbol,
                    inline: line
                })
            }
        }

        // remember context
        if (blocks.length > 0) {
            prevBlock = getLast(blocks);
            prevBlock.lineNumber = i;
        }
    }

    for (let containerBlock of containerBlocks) {
        let blockData = parseLines(containerBlock.innerLines, NODE_KIND.STRING);
        linkDefinitions.concat(blockData.linkDefinitions);
        imageDefinitions.concat(blockData.imageDefinitions);
        containerBlock.children = blockData.blocks;
    }
    return {
        blocks: blocks,
        linkDefinitions: linkDefinitions,
        imageDefinitions: imageDefinitions
    };
}

export default function parseMarkdown(lines) {
    let chunks = [];
    let blockData = parseLines(lines, NODE_KIND.PARAGRAPH);
    for (let i = 0; i < blockData.blocks.length; i++) {
        if (blockData.blocks[i].kind !== NODE_KIND.BLANK) {
            chunks.push(parseBlock(blockData.blocks[i], blockData.linkDefinitions, blockData.imageDefinitions));
        }
    }
    return chunks;
}