import PropTypes from 'prop-types';
import Link from 'next/link';

import { getGlocalClassname } from '../../../lib/utils/ops.util';
import Time from '../../time/time.component';
import styles from './feed-item.module.scss';

function FeedItem({ title, description, pubDate, link, loading, guid }) {
  const item = {
    guid: guid,
    title: title || '',
    description: description || '',
    pubDate: pubDate || '',
    link: link || '#'
  };
  return (
    <li className={getGlocalClassname(styles, 'feed-item')}>
      { loading ? renderLoading() : renderItem(item) }
    </li>
  );
}

function renderLoading() {
  const loadingClassName = getGlocalClassname(styles, 'feed-item--loading');
  return (
    <>
      <h3 className={loadingClassName}>&nbsp;</h3>
      <p className={loadingClassName}>
      <span className={loadingClassName}></span>
      <span className={loadingClassName}></span>
      <span className={loadingClassName}></span>
      </p>
      <span className={loadingClassName}></span>
      <br/>
    </>
  );
}

function renderItem(item) {
  const linkStr = `${item.link}[id]`;
  const linkAs = `${item.link}${item.guid}`;
  return (
    <>
      <h3><Link href={linkStr} as={linkAs}><a>{item.title}</a></Link></h3>
      <p><Link href={linkStr} as={linkAs}><a>{item.description}</a></Link></p>
      <Time dateTime={item.pubDate}></Time>
      <br/>
    </>
  );
}

FeedItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  pubDate: PropTypes.string,
  link: PropTypes.string,
  loading: PropTypes.bool,
  guid: PropTypes.string
};

export default FeedItem;