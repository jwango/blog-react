import React, { Component, Fragment } from 'react';
import PropTypes  from 'prop-types';

import format from 'date-fns/format';
import parse from 'date-fns/parse';

import { getDefault } from '../../lib/utils/ops.util';
import HeadCustom from '../../components/head-custom/head-custom.component';
import MdFragment from '../../components/md-fragment/md-fragment.component';
import Tag from '../../components/tag/tag.component';
import Time from '../../components/time/time.component';
import ErrorView from '../../components/error-view/error-view.component';

import parseMarkdown from '../../lib/utils/parse.util';
import Published from '../../cms/out/published.json';
import Metadata from '../../cms/out/metadata.json';
import fs from 'fs';

export default class Post extends Component {

    static propTypes = {
        match: PropTypes.any
    }

    static defaultState = {
        title: 'Untitled',
        description: '',
        chunks: [],
        lastUpdateDate: '?',
        pubDate: '?',
        tags: [],
        error: undefined,
        postData: undefined
    }

    constructor(props) {
        super(props);
        let postData = JSON.parse(props.postData);
        let error = props.error;
        this.state = {
            title: getDefault(postData.title, Post.defaultState.title),
            description: getDefault(postData.description, Post.defaultState.description),
            chunks: getDefault(postData.body, Post.defaultState.chunks),
            lastUpdateDate: getDefault(this.getFormattedDate(postData.lastUpdateDate), Post.defaultState.lastUpdateDate),
            pubDate: getDefault(this.getFormattedDate(postData.publishDate), Post.defaultState.pubDate),
            tags: getDefault(postData.tags, Post.defaultState.tags),
            guid: postData.guid,
            error: error
        };
    }

    componentDidMount() {
      setTimeout(() => {
        if (this.props.disqusUrl) {
            const title = this.state.title;
            const id = this.state.guid;
            const canonUrl = this.getCanonicalUrl();
            window.disqus_config = function () {
                this.page.title = `${title}-${id}`;
                this.page.identifier = id;
                this.page.url = `${canonUrl.baseUrl}${canonUrl.relUrl}`;
            };

            const s = document.createElement('script');
            s.src = this.props.disqusUrl;
            s.setAttribute('data-timestamp', +new Date());
            (document.head || document.body).appendChild(s);
        }
      }, 0);
    }

    getCanonicalUrl() {
        return {
            baseUrl: this.props.publicUrl,
            relUrl: `/posts/${this.state.guid}`
        };
    }

    getFormattedDate(dateStr) {
        if (dateStr) {
            return format(parse(dateStr), 'MMM D, YYYY');
        }
        return dateStr;
    }

    renderLastUpdateDate(publishDate, lastUpdateDate) {
        if (publishDate === lastUpdateDate || !lastUpdateDate) {
            return <Fragment></Fragment>;
        }
        return <Fragment><span className='color-background-faded'> • </span><Time dateTime={lastUpdateDate}></Time></Fragment>;
    }

    renderTags(categories) {
        if (categories) {
            return categories.map((category) => {
                return (
                    <Tag key={category} link={`/?tags=${category}`}>{category}</Tag>
                );
            });
        }
        return <span></span>;
    }

    render() {
        if (this.state.error) {
            return <ErrorView error={this.state.error}></ErrorView>
        }
        const keywords = [
            'blog',
            'react',
            'framework',
            'jwango',
            ...this.state.tags
        ];
        const canonUrl = this.getCanonicalUrl();
        return (
            <article className='post'>
                <HeadCustom
                    title={this.state.title}
                    description={this.state.description}
                    keywords={keywords.join(', ')}
                    baseUrl={canonUrl.baseUrl}
                    relUrl={canonUrl.relUrl}>
                </HeadCustom>
                <header>
                    <h1>{this.state.title}</h1>
                    <Time dateTime={this.state.pubDate}></Time>
                    {this.renderLastUpdateDate(this.state.pubDate, this.state.lastUpdateDate)}
                </header>
                <section className='post__content'>
                    <MdFragment chunks={this.state.chunks} showOutline={true}/>
                </section>
                <footer className='blog__footer'>
                    {this.renderTags(this.state.tags)}
                    <div id='disqus_thread'></div>
                    <noscript>Please enable JavaScript to view the <a href='https://disqus.com/?ref_noscript'>comments powered by Disqus.</a></noscript>
                </footer>
            </article>
        );
    }
}

export async function getStaticPaths() {
    const paths = Object.keys(PublishConfig).map(id => {
        return {
            params: { id }
        };
    });
    return {
        paths: paths,
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    const fileName = Published[params.id];
    if (!fileName) {
        return { props: {} };
    }
    const fileContent = await fs.promises.readFile(fileName, 'utf8');
    const doc = parseMarkdown(fileContent.split('\r\n'));
    const metadata = Metadata.posts.find(post => post.guid === params.id) || doc.metadata;
    const postData = {
        guid: params.id,
        body: doc.chunks,
        ...metadata,
        tags: doc.metadata.tags.split(',').map(item => item.trim())
    };
    
    return { props: { postData: JSON.stringify(postData), error: null, disqusUrl: process.env.DISQUS_URL, publicUrl: process.env.PUBLIC_URL } };
}