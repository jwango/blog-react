import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { getDefault } from '../../../utils/ops.util';
import { Time } from '../../time/time.component';
import './feed-item.scss';
export class FeedItem extends PureComponent {
    
    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        pubDate: PropTypes.string,
        link: PropTypes.string,
        loading: PropTypes.bool
    }

    stripHTML(html){
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    renderLoading() {
        return (
            <Fragment>
                <h3 className="feed-item--loading">Title</h3>
                <p className="feed-item--loading">
                    <div className="feed-item--loading">content</div>
                    <div className="feed-item--loading">is</div>
                    <div className="feed-item--loading">loading</div>
                </p>
                <div className="feed-item--loading">time</div>
                <br/>
            </Fragment>
        );
    }

    renderItem(item) {
        return (
            <Fragment>
                <h3><a href={item.link ? item.link : '#'}>{item.title}</a></h3>
                <p><a href={item.link ? item.link : '#'}>{this.stripHTML(item.description)}</a></p>
                <Time dateTime={item.pubDate}></Time>
                <br/>
            </Fragment>
        );
    }

    render() {
        const item = {
            title: getDefault(this.props.title, ''),
            description: getDefault(this.props.description, ''),
            pubDate: getDefault(this.props.pubDate, ''),
            link: getDefault(this.props.link, '#')
        };
        return (
            <li className='feed-item'>
                { this.props.loading ? this.renderLoading() : this.renderItem(item) }
            </li>
        );
    }
}