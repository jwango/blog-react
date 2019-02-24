import React, { Component } from 'react';
import Parser from 'rss-parser';
import { Feed } from '../../../components/feed/feed.component';

export class Rss extends Component {

  rssDataPromise = undefined;
  loaded = false;

  constructor(props) {
    super(props);
    this.data = [];
    if (!props.staticContext) {
      this.parser = new Parser();
    }
  }

  componentDidMount() {
    if (!this.props.staticContext) {
      this.getRSSData();
    }
  }

  getRSSData() {
    if (this.rssDataPromise) {
      return this.rssDataPromise;
    }
    this.rssDataPromise = new Promise(async (resolve, reject) => {
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
      return resolve(this.sortItems(items));
    });
    this.rssDataPromise.then((res) => {
      this.data = res || [];
      this.loaded = true;
    });
    return this.rssDataPromise;
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

  getMoreItems(page, limit) {
    var sliceData = (data) => data.slice(page * limit, (page + 1) * limit);
    if (!this.loaded) {
      return this.getRSSData().then(sliceData);
    }
    return Promise.resolve(sliceData(this.data || []));
  }

  render() {
    return (
      <Feed batchSize={2} getMoreFunc={this.getMoreItems.bind(this)}/>
    );
  }
}
