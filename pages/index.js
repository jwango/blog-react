import React, { Component, Fragment } from 'react';
import { withRouter } from 'next/router';
import compareDesc from 'date-fns/compare_desc';

import Icon, { IconNames } from '../components/icon/icon.component';
import HeadCustom from '../components/head-custom/head-custom.component';
import Feed from '../components/feed/feed.component';
import Tag from '../components/tag/tag.component';

import Metadata from '../cms/out/metadata.json';

const batchSize = 2;

class Blog extends Component {

    errorMessage = '';

    constructor(props) {
        super(props);
    }

    readStringStream(rs) {
        return new Promise((resolve, reject) => {
            let data = '';
            rs.on('data', (chunk) => data += chunk);
            rs.on('end', () => resolve(data));
            rs.on('error', (error) => reject(error.message));
        });
    }

    getTagsParam() {
        return this.props.router.query['tags'] || '';
    }

    getMorePosts(page, limit) {
        const tagsParam = this.getTagsParam();
        return fetchPosts(page, limit, tagsParam, this.props.postsMetadata);
    }

    getPathWithoutTag(tag, tags) {
        let tagsQuery = tags.reduce((acc, val, i) => {
            if (val !== tag) {
                if (!!acc) {
                    acc += '+';
                }
                acc += val;
            }
            return acc;
        }, '')
        if (tagsQuery) {
            tagsQuery = `?tags=${tagsQuery}`;
        }
        return '/' + tagsQuery;
    }

    renderTags() {
        const tagsParam = this.getTagsParam();
        const tags = tagsParam ? tagsParam.split(/ /g) : [];
        return tags.map((tag, index, arr) => {
            return (
                <Tag key={tag}>
                    <a href={this.getPathWithoutTag(tag, arr)}>
                        <Icon name={this.props.iconNames.TIMES} baseline={true}></Icon>
                    </a>
                    &nbsp;{tag}
                </Tag>
            );
        });
    }

    render() {
        return (
            <Fragment>
                <HeadCustom
                    title='blog-react'
                    description='built by github/jwango'
                    keywords='blog, react, framework, jwango'
                    baseUrl={this.props.publicUrl}
                    relUrl='/'>
                </HeadCustom>
                <header>{this.renderTags()}</header>
                <Feed batchSize={batchSize} getMoreFunc={this.getMorePosts.bind(this)} initialItems={this.props.initialItems}/>
            </Fragment>
        );
    }
}

function fetchPosts(page, limit, tagsParam, postsMetadata) {
    const tags = tagsParam.split(' ');
    const startIndex = page * limit;
    return Promise.resolve(
        postsMetadata.posts
            .filter(item => !tagsParam || tags.some(tagToMatch => item.tags.includes(tagToMatch)))
            .sort((a, b) => compareDesc(a.publishDate, b.publishDate))
            .filter((_val, index) => index >= startIndex && index < startIndex + limit)
            .map(item => {
                return {
                    id: item.guid,
                    title: item.title,
                    description: item.description,
                    pubDate: item.publishDate,
                    link: '/posts/'
                };
            })
    )
}

export async function getStaticProps() {
    const initialItems = await fetchPosts(0, batchSize, '', Metadata);
    return { props: { publicUrl: process.env.PUBLIC_URL, postsMetadata: Metadata, iconNames: IconNames, initialItems } }
}

export default withRouter(Blog);