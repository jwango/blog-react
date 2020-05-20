import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { POST_KIND } from './globals';

const MdFragment = React.memo(({ chunks, pinDepth }) => {
  chunks = chunks || [];
  pinDepth = pinDepth || 1;

   return <>{renderChunks(chunks, pinDepth)}</>;
}, (props, nextProps) => {
  if (nextProps !== props) {
      return true;
  }
  return JSON.stringify(nextProps) !== JSON.stringify(props);
});

function renderChunks(chunks, pinDepth, level = 0) {
  return chunks.map((chunk, index) => <Fragment key={index}>{renderChunk(chunk, level, pinDepth)}</Fragment>);
}

function renderOutlinePin(chunk, content) {
  if (chunk.children) {
    return <Fragment>{content}</Fragment>;
  }
  const id = content.toLowerCase().trim().split(' ').join('-');
  return (
    <>
      <span id={id} className='anchor'></span>
      {content}
      <a href={`#${id}`}>
        <img src='/link-1.svg' alt={id} className='pin'/>
      </a>
    </>
  );
}

function renderChunk(chunk, level, pinDepth) {
  let kind = chunk.kind || POST_KIND.STRING;
  let content = chunk.content || '';
  let props = chunk.meta || {};

  if (chunk.children) {
    content = renderChunks(chunk.children, pinDepth, level + 1);
  }

  if (kind === POST_KIND.BOLD) {
    return <strong>{content}</strong>;
  }
  if (kind === POST_KIND.BLOCKQUOTE) {
    return <blockquote>{content}</blockquote>;
  }
  if (kind === POST_KIND.BREAK) {
    return <br />;
  }
  if (kind === POST_KIND.CODE_INLINE) {
    return <code>{content}</code>;
  }
  if (kind === POST_KIND.CODE_FENCE) {
    const langClass = props.info ? `language-${props.info}` : '';
    return <pre><code className={`codeBlock ${langClass}`}>{content}</code></pre>;
  }
  if (kind === POST_KIND.HEADING_1) {
    if (level === 0 && pinDepth >= 1) {
      return <h1>{renderOutlinePin(chunk, content)}</h1>;
    }
    return <h1>{content}</h1>;
  }
  if (kind === POST_KIND.HEADING_2) {
    if (level === 0 && pinDepth >= 2) {
      return <h2>{renderOutlinePin(chunk, content)}</h2>;
    }
    return <h2>{content}</h2>;
  }
  if (kind === POST_KIND.HEADING_3) {
    if (level === 0 && pinDepth >= 3) {
      return <h3>{renderOutlinePin(chunk, content)}</h3>;
    }
    return <h3>{content}</h3>;
  }
  if (kind === POST_KIND.HEADING_4) {
    if (level === 0 && pinDepth >= 4) {
      return <h4>{renderOutlinePin(chunk, content)}</h4>;
    }
    return <h4>{content}</h4>;
  }
  if (kind === POST_KIND.HEADING_5) {
    if (level === 0 && pinDepth >= 5) {
      return <h5>{renderOutlinePin(chunk, content)}</h5>;
    }
    return <h5>{content}</h5>;
  }
  if (kind === POST_KIND.HEADING_6) {
    if (level === 0 && pinDepth >= 6) {
      return <h6>{renderOutlinePin(chunk, content)}</h6>;
    }
    return <h6>{content}</h6>;
  }
  if (kind === POST_KIND.IMAGE) {
    return <img src={props.src} alt={props.alt || 'untitled image'}/>;
  }
  if (kind === POST_KIND.ITALICS) {
    return <em>{content}</em>;
  }
  if (kind === POST_KIND.LINK) {
    return <a href={props.url || '#'} title={props.title || ''}>{content}</a>;
  }
  if (kind === POST_KIND.LIST_ITEM) {
    return <li>{content}</li>;
  }
  if (kind === POST_KIND.LIST_ORDERED) {
    return <ol start={props.start ? props.start : '1'}>{content}</ol>;
  }
  if (kind === POST_KIND.LIST_UNORDERED) {
    return <ul>{content}</ul>;
  }
  if (kind === POST_KIND.PARAGRAPH) {
    return <p>{content}</p>;
  }
  if (kind === POST_KIND.STRIKE) {
    return <s>{content}</s>;
  }
  if (kind === POST_KIND.THEMATIC_BREAK) {
    return <hr />;
  }
  return <Fragment>{content}</Fragment>;
}

MdFragment.propTypes =  {
  chunks: PropTypes.array,
  pinDepth: PropTypes.number
};

export default MdFragment;