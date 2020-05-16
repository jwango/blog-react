import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import FeedItem from './feed-item/feed-item.component';
import { getDefault } from '../../lib/utils/ops.util';

export default class Feed extends Component {

    static propTypes = {
        batchSize: PropTypes.number,
        getMoreFunc: PropTypes.func,
        initialItems: PropTypes.items
    };

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            batchSize: getDefault(props.batchSize, 0),
            page: 0,
            loading: false,
            hasMore: true
        };
        if (props.initialItems) {
                this.state = {
                ...this.state,
                ...this.addItems(props.initialItems, this.state.batchSize)
            };
        }
    }

    getMoreItems(page, limit) {
        if (this.state.loading) {
            return Promise.resolve(null);
        }
        const newItems = [{
            loading: true
        }];
        this.setState({
            items: this.state.items.concat(newItems),
            loading: true
        });
        return this.props.getMoreFunc(page, limit)
            .then(
                (res) => {
                    this.setState(this.addItems(res, limit));
                    return res;
                },
                (err) => {
                    this.setState({
                        items: this.state.items.slice(0, -1),
                        loading: false,
                        hasMore: true
                    });
                    throw err;
                }
            );
    }

    addItems(items, limit) {
        const hasMore = (items || []).length == limit;
        if (items && items.length > 0) {
            return {
                page: this.state.page + 1,
                items: this.state.items.slice(0, -1).concat(items),
                loading: false,
                hasMore: hasMore
            };
        } else {
            return {
                items: this.state.items.slice(0, -1),
                loading: false,
                hasMore: hasMore
            };
        }
    }

    renderItemComponents() {
        return this.state.items.map((story) => {
            return (
                <FeedItem
                    loading={!!story.loading}
                    title={story.title}
                    link={story.link}
                    description={story.description}
                    pubDate={story.pubDate}
                    guid={story.id}
                    key={story.id}
                />
            );
        });
    }

    renderMoreButton() {
        if (this.state.loading || !this.state.hasMore) {
            return <Fragment></Fragment>;
        }
        return <button className='btn--secondary btn--flat' onClick={() => this.getMoreItems(this.state.page, this.state.batchSize)}>More Content</button>
    }
    
    render() {
        return (
            <Fragment>
                <section>
                    <ul className='feed'>
                        {this.renderItemComponents()}
                    </ul>
                </section>
                {this.renderMoreButton()}
            </Fragment>
        );
    }
}