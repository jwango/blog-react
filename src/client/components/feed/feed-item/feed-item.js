import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getDefault } from '../../../utils/ops.util';
import { Time } from '../../time/time.component';

export class FeedItem extends PureComponent {
    
    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        pubDate: PropTypes.string,
        link: PropTypes.string
    }

    stripHTML(html){
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    render() {
        const item = {
            title: getDefault(this.props.title, 'N/A'),
            description: getDefault(this.props.description, ''),
            pubDate: getDefault(this.props.pubDate, ''),
            link: getDefault(this.props.link, '#')
        };
        return (
            <article className='feed-item'>
                <h3><a href={item.link ? item.link : '#'}>{item.title}</a></h3>
                <summary><a href={item.link ? item.link : '#'}>{this.stripHTML(item.description)}</a></summary>
                <Time dateTime={item.pubDate}></Time>
                <br/>
            </article>
        );
    }
}