import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Parser from 'rss-parser';
import { FeedItem } from './feed-item/feed-item';
import { getDefault } from '../../utils/ops.util';

export class Feed extends Component {

    static propTypes = {
        batchSize: PropTypes.number,
    };

    static defaultProps = {
        batchSize: -1
    };

    parser = undefined;

    constructor(props) {
        super(props);
        this.state = {
            items: undefined,
            batchSize: getDefault(props.batchSize, -1),
            page: 1,
            canShow: false
        };
        this.parser = new Parser();
        if (!props.staticContext) {
            this.getRSSData();
        }
    }

    sortItems(itemsArr) {
        return itemsArr.sort((a, b) => {
            if (a.pubDate && b.pubDate) {
                let aDate = new Date(a.pubDate);
                let bDate = new Date(b.pubDate);
                if (aDate > bDate) {
                    return -1;
                }
                if (aDate < bDate) {
                    return 1;
                }
                return 0;
            }
            if (a.pubDate) {
                return -1;
            }
            if (b.pubDate) {
                return 1;
            }
            return 0;
        });
    }

    getRSSData() {
        this.state.canShow = false;
        setTimeout((context) => {
            context.setState({ canShow: true });
        }, 500, this);
        (async () => {
            let feed = await this.parser.parseURL('/rss.xml');
            let items = feed.items.map((item, index) => {
                return {
                    title: item.title,
                    link: item.link,
                    description: item.content,
                    pubDate: item.pubDate,
                    guid: index.toString(),
                }
            });
            this.setState({
                items: this.sortItems(items)
            });
        })();
    }

    getMaxItems() { 
        return this.state.batchSize < 0
            ? this.state.items.length
            : Math.min(this.state.batchSize * this.state.page, this.state.items.length);
    }

    hasMoreItems() {
        return this.state.items && this.getMaxItems() < this.state.items.length;
    }

    showMoreItems() {
        if (this.hasMoreItems()) {
            this.setState({
                page: this.state.page + 1
            });
        }
    }

    renderItemComponents() {
        let loading = true;
        let items = [{}, {}];
        if (this.state.items && this.state.canShow) {
            let maxItems = this.getMaxItems();
            items = this.state.items.slice(0, maxItems);
            loading = false;
        }
        return items.map((story) => {
            return (
                <FeedItem
                    loading={loading}
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
        if (this.hasMoreItems()) {
            return <button onClick={() => this.showMoreItems()}>More Content</button>
        }
    }
    
    render() {
        return (
            <Fragment>
                <section className="feed">
                    {this.renderItemComponents()}
                </section>
                {this.renderMoreButton()}
            </Fragment>
        );
    }
}