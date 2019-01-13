import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tag } from '../../tag/tag.component';
import { getDefault } from '../../../utils/ops.util';

export class FeedItem extends PureComponent {
    
    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        pubDate: PropTypes.string,
        link: PropTypes.string,
        categories: PropTypes.arrayOf(PropTypes.string)
    }

    stripHTML(html){
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    renderTags(categories) {
        if (categories) {
            return categories.map((category) => {
                return (
                    <Tag name={category } key={category}/>
                );
            });
        }
        return <span></span>;
    }

    render() {
        const item = {
            title: getDefault(this.props.title, 'N/A'),
            description: getDefault(this.props.description, ''),
            pubDate: getDefault(this.props.pubDate, 'N/A'),
            link: getDefault(this.props.link, '#'),
            categories: getDefault(this.props.categories, [])
        };
        return (
            <article className='feed-item'>
                <h3><a href={item.link ? item.link : '#'}>{item.title}</a></h3>
                <summary>{this.stripHTML(item.description)}</summary>
                <time>-{item.pubDate}</time>
                <br/>
                {this.renderTags(item.categories)}
            </article>
        );
    }
}