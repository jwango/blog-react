import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { POST_KIND } from './globals';
import { getDefault } from '../../lib/utils/ops.util';

export default class MdFragment extends Component {

    static propTypes = {
        chunks: PropTypes.array,
        showOutline: PropTypes.bool
    };

    static defaultProps = {
        chunks: [],
        showOutline: false
    };

    shouldComponentUpdate(nextProps, nextState) {
        // Default shallow comparison
        if (nextProps !== this.props || nextState !== this.state) {
            return true;
        }
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    getLanguageClass(lang) {
        if (lang) {
            return `language-${lang}`;
        }
        return '';
    }

    renderOutlinePin(chunk, content) {
        if (chunk.children || !this.props.showOutline) {
            return <h1>{content}</h1>;
        }
        const id = content.toLowerCase().split(' ').join('-');
        return (
            <Fragment>
            <h1>
                <span id={id} className='anchor'></span>
                {content}
                <a href={`#${id}`}>
                    <img src='/link-1.svg' alt={id} className='pin'/>
                </a>
            </h1>
            </Fragment>
        );
    }

    renderChunk(chunk) {
        let kind = getDefault(chunk.kind, POST_KIND.STRING);
        let content = getDefault(chunk.content, '');
        let props = getDefault(chunk.meta, {});

        if (chunk.children) {
            content = this.renderChunks(chunk.children);
        }

        if (kind === POST_KIND.BOLD) {
            return <strong>{content}</strong>;
        }
        if (kind === POST_KIND.BLOCKQUOTE) {
            return <blockquote>{content}</blockquote>;
        }
        if (kind === POST_KIND.BREAK) {
            return <br />
        }
        if (kind === POST_KIND.CODE_INLINE) {
            return <code>{content}</code>;
        }
        if (kind === POST_KIND.CODE_FENCE) {
            return <pre><code className={`codeBlock ${this.getLanguageClass(props.info)}`}>{content}</code></pre>;
        }
        if (kind === POST_KIND.HEADING_1) {
            return this.renderOutlinePin(chunk, content);
        }
        if (kind === POST_KIND.HEADING_2) {
            return <h2>{content}</h2>;
        }
        if (kind === POST_KIND.HEADING_3) {
            return <h3>{content}</h3>;
        }
        if (kind === POST_KIND.HEADING_4) {
            return <h4>{content}</h4>;
        }
        if (kind === POST_KIND.HEADING_5) {
            return <h5>{content}</h5>;
        }
        if (kind === POST_KIND.HEADING_6) {
            return <h6>{content}</h6>;
        }
        if (kind === POST_KIND.IMAGE) {
            return <img src={props.src} alt={getDefault(props.alt, 'untitled image')}/>
        }
        if (kind === POST_KIND.ITALICS) {
            return <em>{content}</em>;
        }
        if (kind === POST_KIND.LINK) {
            return <a href={getDefault(props.url, '#')} title={getDefault(props.title, '')}>{content}</a>;
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
            return <p>{content}</p>
        }
        if (kind === POST_KIND.STRIKE) {
            return <s>{content}</s>;
        }
        if (kind === POST_KIND.THEMATIC_BREAK) {
            return <hr />;
        }
        return <Fragment>{content}</Fragment>;
    }

    renderChunks(chunks) {
        return chunks.map((chunk, index) => <Fragment key={index}>{this.renderChunk(chunk)}</Fragment>);
    }

    render() {
        return <Fragment>{this.renderChunks(getDefault(this.props.chunks, []))}</Fragment>;
    }
}