import PropTypes from 'prop-types';
import Link from 'next/link';

function Tag({ link, children }) {
    let classes = 'tag';
    if (link) {
        classes += ' tag--linkable';
    }
    return <span className={classes}>{renderInner(link, children)}</span>
}

function renderInner(link, children) {
    if (link) {
        return <Link href={link}><a>{children}</a></Link>;
    }
    return children;
}

Tag.propTypes = { link: PropTypes.string }

export default Tag;