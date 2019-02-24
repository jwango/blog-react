import React, { Component, Fragment } from 'react';
import { Feed } from '../../../components/feed/feed.component';
import { Tag } from '../../../components/tag/tag.component';
import { parseQueryString } from '../../../utils/parse.util';
import fetch from 'isomorphic-fetch';

export class Blog extends Component {

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
        return parseQueryString(this.props.location.search).tags;
    }

    getMorePosts(page, limit) {
        const tagsParam = this.getTagsParam();
        const newTagsParam = tagsParam ? `&tags=${tagsParam}` : '';
        return fetch(`${window.__GATEWAY_URL__}/posts/meta?page=${page}&limit=${limit}${newTagsParam}`)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    return res.json().then(
                        (res) => {
                            return res.map((item) => {
                                return Object.assign(item, { link: `/blog/posts/${item.id}` });
                            });
                        });
                } else {
                    this.readStringStream(res.body)
                        .then((msg) => {
                            this.errorMessage = msg || res.statusText;
                        }, (err) => {
                            this.errorMessage = res.statusText;
                        });
                    throw new Error(res.statusText);
                }
            });
    }

    removeTag(tag, tags) {
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
        this.props.history.push(`/blog${tagsQuery}`);
    }

    renderTags() {
        const tagsParam = this.getTagsParam();
        const tags = tagsParam ? tagsParam.split(/\+/g) : [];
        return tags.map((tag, index, arr) => {
            return (
                <Tag key={tag}>
                    <button onClick={this.removeTag.bind(this, tag, arr)}><span className="fa fa-times"></span></button>&nbsp;{tag}
                </Tag>
            );
        });
    }

    render() {
        return (
            <Fragment>
                <header>{this.renderTags()}</header>
                <Feed key={this.props.location.key} batchSize={2} getMoreFunc={this.getMorePosts.bind(this)}/>
            </Fragment>
        );
    }
}