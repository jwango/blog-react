import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FeedItem from './feed-item/feed-item.component';

function Feed({ batchSize, getMoreFunc, initialItems, customKey }) {
  batchSize = batchSize || 0;

  const [state, setState] = useState({
    items: initialItems,
    batchSize: batchSize,
    page: 0,
    loading: false,
    hasMore: true
  });

  const getMoreItems = () => {
    if (state.loading) {
      return;
    }
    const newItems = [{
      loading: true
    }];
    setState({
      ...state,
      items: state.items.concat(newItems),
      loading: true
    });
    getMoreFunc(state.page, state.batchSize)
      .then(
        (res) => {
          const newState = addItems(state.items, res, state.page, state.batchSize);
          setState({
            ...state,
            ...newState
          });
        },
        (err) => {
          setState({
            ...state,
            items: state.items.slice(0, -1),
            loading: false,
            hasMore: true
          });
          throw err;
        }
      );
  };

  useEffect(() => {
    if (initialItems) {
      const newState = addItems([], initialItems, 0, state.batchSize);
      setState({
        batchSize: state.batchSize,
        ...newState
      });
    }
  }, [customKey]);
    
  return (
      <>
          <section>
              <ul className='feed'>
                  {renderItemComponents(state.items)}
              </ul>
          </section>
          {renderMoreButton(state.loading, state.hasMore, getMoreItems)}
      </>
  );
}

function renderItemComponents(items) {
  return items.map((story) => {
    return (
      <FeedItem
        loading={!!story.loading}
        title={story.title}
        link={story.link}
        description={story.description}
        pubDate={story.pubDate}
        guid={story.id}
        key={story.id}
      />
    );
  });
}

function renderMoreButton(loading, hasMore, clickHandler) {
  if (loading || !hasMore) {
    return null;
  }
  return <button className='btn--secondary btn--flat' onClick={clickHandler}>More Content</button>
}

function addItems(oldItems, newItems, page, limit) {
  const hasMore = (newItems || []).length == limit;
  const origItems = oldItems.filter(item => !item.loading);
  if (newItems && newItems.length > 0) {
    return {
      page: page + 1,
      items: origItems.concat(newItems),
      loading: false,
      hasMore: hasMore
    };
  } else {
    return {
      items: origItems,
      loading: false,
      hasMore: hasMore
    };
  }
}

Feed.propTypes = {
  batchSize: PropTypes.number,
  getMoreFunc: PropTypes.func,
  initialItems: PropTypes.array
};

export default Feed;