import React, { Component } from 'react';
import PropTypes  from 'prop-types';
import { getDefault } from '../../../../utils/ops.util';
import { MdFragment } from '../../../../components/md-fragment';
import { Tag } from '../../../../components/tag/tag.component';
import fetch from 'isomorphic-fetch';

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
        this.state = Post.defaultState;
        this.state.guid = props.match.params.postId;
    }

    componentDidMount() {
        this.getPostData();
    }

    getPostData() {
        // TODO: pull base url from environment variable
        const encodedURI = encodeURI(`http://localhost:3001/posts/${this.state.guid}`);
        fetch(encodedURI)
            .then((res) => {
                const postData = res.data;
                if (postData) {
                    this.setState({
                        title: getDefault(postData.title, Post.defaultState.title),
                        chunks: getDefault(postData.body, Post.defaultState.chunks),
                        author: getDefault(postData.author, Post.defaultState.author),
                        pubDate: getDefault(postData.pubDate, Post.defaultState.pubDate),
                        tags: getDefault(postData.tags, Post.defaultState.tags)
                    });
                }
            })
            .catch((error) => console.log(error));
    }

    renderTags(categories) {
        if (categories) {
            return categories.map((category) => {
                return (
                    <Tag name={category } key={category}/>
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