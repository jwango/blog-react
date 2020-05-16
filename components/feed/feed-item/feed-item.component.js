import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { getDefault, getGlocalClassname } from '../../../lib/utils/ops.util';
import Time from '../../time/time.component';
import styles from './feed-item.module.scss';
export default class FeedItem extends PureComponent {
    
    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        pubDate: PropTypes.string,
        link: PropTypes.string,
        loading: PropTypes.bool,
        guid: PropTypes.string
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
        const linkStr = `${item.link}[id]`;
        const linkAs = `${item.link}${this.props.guid}`;
        return (
            <Fragment>
                <h3><Link href={linkStr} as={linkAs}><a>{item.title}</a></Link></h3>
                <p><Link href={linkStr} as={linkAs}><a>{item.description}</a></Link></p>
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