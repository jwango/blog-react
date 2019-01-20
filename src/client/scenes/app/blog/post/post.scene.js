import React, { Component } from 'react';
import PropTypes  from 'prop-types';
import { getDefault } from '../../../../utils/ops.util';
import { MdFragment } from '../../../../components/md-fragment';
import { Tag } from '../../../../components/tag/tag.component';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

export class Post extends Component {

    static propTypes = {
        match: PropTypes.any
    }

    static defaultState = {
        title: 'Untitled',
        chunks: [],
        author: 'Unknown author',
        pubDate: '',
        tags: []
    }

    constructor(props) {
        super(props);
        let postData = {};
        if (this.props.staticContext) {
            postData = this.props.staticContext.postData;
        } else if (window.__INITIAL_DATA__) {
            postData = Object.assign({}, window.__INITIAL_DATA__.postData);
        }
        this.state = {
            title: getDefault(postData.title, Post.defaultState.title),
            chunks: getDefault(postData.body, Post.defaultState.chunks),
            author: getDefault(this.getAuthorName(postData.author), Post.defaultState.author),
            pubDate: getDefault(this.getPublishDate(postData.publishDate), Post.defaultState.pubDate),
            tags: getDefault(postData.tags, Post.defaultState.tags),
            guid: props.match.params.postId
        };
    }

    getAuthorName(author) {
        if (author) {
            return author.name;
        }
        return author;
    }

    getPublishDate(dateStr) {
        if (dateStr) {
            return format(parse(dateStr), 'MMM D, YYYY');
        }
        return dateStr;
    }

    renderTags(categories) {
        if (categories) {
            return categories.map((category) => {
                return (
                    <Tag name={category} key={category} link={`/blog/tags/${category}`}/>
                );
            });
        }
        return <span></span>;
    }

    render() {
        return (
            <article>
                <header>
                    <h1>{this.state.title}</h1>
                    <h2>By: {this.state.author}, written {this.state.pubDate}</h2>
                </header>
                <MdFragment chunks={this.state.chunks} showOutline={true}/>
                <footer className="blog__footer">
                    {this.renderTags(this.state.tags)}
                </footer>
            </article>
        );
    }
}