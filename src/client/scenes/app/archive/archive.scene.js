import React, { Component } from 'react';
import { Feed } from '../../../components/feed/feed.component';
import fetch from 'isomorphic-fetch';

export class Archive extends Component {

    errorMessage = '';

    readStringStream(rs) {
        return new Promise((resolve, reject) => {
            let data = '';
            rs.on('data', (chunk) => data += chunk);
            rs.on('end', () => resolve(data));
            rs.on('error', (error) => reject(error.message));
        });
    }

    getMorePosts(page, limit) {
        return fetch(`${window.__GATEWAY_URL__}/posts/meta?page=${page}&limit=${limit}`)
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

    render() {
        return <Feed batchSize={2} getMoreFunc={this.getMorePosts.bind(this)}/>;
    }
}