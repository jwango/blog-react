import React, { Component, Fragment } from 'react';
import PropTypes  from 'prop-types';
import { getDefault } from '../../../utils/ops.util';
import { MdFragment } from '../../../components/md-fragment';
import { Tag } from '../../../components/tag/tag.component';
import { Time } from '../../../components/time/time.component';
import { ErrorView } from '../../../components/error-view/error-view.component';
import { MultiView } from '../../../components/multi-view/multi-view.component';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

export class Post extends Component {

    static propTypes = {
        match: PropTypes.any
    }

    static defaultState = {
        title: 'Untitled',
        chunks: [],
        lastUpdateDate: '?',
        pubDate: '?',
        tags: [],
        error: undefined
    }

    constructor(props) {
        super(props);
        let postData = {};
        let error = undefined;
        if (this.props.staticContext) {
            postData = this.props.staticContext.postData;
            error = this.props.staticContext.error;
        } else if (window.__INITIAL_DATA__) {
            postData = Object.assign({}, window.__INITIAL_DATA__.postData);
            error = window.__INITIAL_DATA__.error;
        }
        this.state = {
            title: getDefault(postData.title, Post.defaultState.title),
            chunks: getDefault(postData.body, Post.defaultState.chunks),
            lastUpdateDate: getDefault(this.getFormattedDate(postData.lastUpdateDate), Post.defaultState.lastUpdateDate),
            pubDate: getDefault(this.getFormattedDate(postData.publishDate), Post.defaultState.pubDate),
            tags: getDefault(postData.tags, Post.defaultState.tags),
            guid: props.match.params.postId,
            error: error
        };
    }

    getFormattedDate(dateStr) {
        if (dateStr) {
            return format(parse(dateStr), 'MMM D, YYYY');
        }
        return dateStr;
    }

    handleSubmit(event) {
        alert('This feature is in progress.');
        event.preventDefault();
    }

    renderLastUpdateDate(publishDate, lastUpdateDate) {
        if (publishDate === lastUpdateDate || !lastUpdateDate) {
            return <Fragment></Fragment>;
        }
        return <Fragment><span className="color-background-faded"> • </span><Time dateTime={lastUpdateDate}></Time></Fragment>;
    }

    renderTags(categories) {
        if (categories) {
            return categories.map((category) => {
                return (
                    <Tag key={category} link={`/blog?tags=${category}`}>{category}</Tag>
                );
            });
        }
        return <span></span>;
    }

    render() {
        if (this.state.error) {
            return <ErrorView error={this.state.error}></ErrorView>
        }
        return (
            <article className="post">
                <header>
                    <h1>{this.state.title}</h1>
                    <Time dateTime={this.state.pubDate}></Time>
                    {this.renderLastUpdateDate(this.state.pubDate, this.state.lastUpdateDate)}
                </header>
                <section className="post__content">
                    <MdFragment chunks={this.state.chunks} showOutline={true}/>
                </section>
                <footer className="blog__footer">
                    {this.renderTags(this.state.tags)}
                </footer>
            </article>
        );
    }
}