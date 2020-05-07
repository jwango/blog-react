import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { getDefault, getGlocalClassname } from '../../../lib/utils/ops.util';
import Time from '../../time/time.component';
import styles from './feed-item.module.scss';
export default class FeedItem extends PureComponent {
    
    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        pubDate: PropTypes.string,
        link: PropTypes.string,
        loading: PropTypes.bool
    }

    stripHTML(html){
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }

    renderLoading() {
        const loadingClassName = getGlocalClassname(styles, 'feed-item--loading');
        return (
            <Fragment>
                <h3 className={loadingClassName}>&nbsp;</h3>
                <p className={loadingClassName}>
                    <span className={loadingClassName}></span>
                    <span className={loadingClassName}></span>
                    <span className={loadingClassName}></span>
                </p>
                <span className={loadingClassName}></span>
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
            <li className={getGlocalClassname(styles, 'feed-item')}>
                { this.props.loading ? this.renderLoading() : this.renderItem(item) }
            </li>
        );
    }
}