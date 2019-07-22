import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FeedItem } from './feed-item/feed-item';
import { getDefault } from '../../utils/ops.util';

export class Feed extends Component {

    static propTypes = {
        batchSize: PropTypes.number,
        getMoreFunc: PropTypes.func
    };

    static defaultProps = {
        batchSize: 0,
        getMoreFunc: undefined
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
    }

    componentDidMount() {
        if (!this.props.staticContext) {
            this.getMoreItems(this.state.page, this.state.batchSize);
        }
    }

    getMoreItems(page, limit) {
        if (this.state.loading) {
            return Promise.resolve(null);
        }
        let newItems = [];
        for (let i = 0; i < limit; i++) {
            newItems.push({
                loading: true
            });
        }
        this.setState({
            items: this.state.items.concat(newItems),
            loading: true
        });
        var minTimePromise = new Promise((resolve, reject) => {
            setTimeout((callback) => { callback(); }, 500, resolve);
        });
        return Promise.all([this.props.getMoreFunc(page, limit), minTimePromise])
            .then((res) => res[0])
            .then(
                (res) => {
                    var hasMore = (res || []).length == limit;
                    if (res && res.length > 0) {
                        this.setState({
                            page: this.state.page + 1,
                            items: this.state.items.slice(0, -1 * limit).concat(res),
                            loading: false,
                            hasMore: hasMore
                        });
                    } else {
                        this.setState({
                            items: this.state.items.slice(0, -1 * limit),
                            loading: false,
                            hasMore: hasMore
                        });
                    }
                    return res;
                },
                (err) => {
                    this.setState({
                        items: this.state.items.slice(0, -1 * limit),
                        loading: false,
                        hasMore: true
                    });
                    throw err;
                }
            );
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
                    guid={story.guid}
                    key={story.guid}
                />
            );
        });
    }

    renderMoreButton() {
        if (this.state.loading || !this.state.hasMore) {
            return <Fragment></Fragment>;
        }
        return <button className="btn--secondary btn--flat" onClick={() => this.getMoreItems(this.state.page, this.state.batchSize)}>More Content</button>
    }
    
    render() {
        return (
            <Fragment>
                <section>
                    <ul className="feed">
                        {this.renderItemComponents()}
                    </ul>
                </section>
                {this.renderMoreButton()}
            </Fragment>
        );
    }
}