import React, { Fragment, useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import compareDesc from 'date-fns/compare_desc';

import Icon, { IconNames } from '../components/icon/icon.component';
import HeadCustom from '../components/head-custom/head-custom.component';
import Feed from '../components/feed/feed.component';
import Tag from '../components/tag/tag.component';

import Metadata from '../cms/out/metadata.json';

const batchSize = 2;

function Blog({ router, publicUrl, postsMetadata, iconNames, defaultItems }) {
  const tagsParam = router.query['tags'] || '';
  const tags = tagsParam ? tagsParam.split(/ /g) : [];
  const [initialItems, setInitialItems] = useState({ items: defaultItems, key: null });
  useEffect(() => {
    async function fetchData() {
      const newItems = await fetchPosts(0, batchSize, tags, postsMetadata);
      setInitialItems({ items: newItems, key: tagsParam });
    }
    fetchData();
  }, [tagsParam]);

  return (
    <Fragment>
      <HeadCustom
        title='blog-react'
        description='built by github/jwango'
        keywords='blog, react, framework, jwango'
        baseUrl={publicUrl}
        relUrl='/'>
      </HeadCustom>
      <header>{renderTags(tags, iconNames)}</header>
      <Feed
        batchSize={batchSize}
        getMoreFunc={(page, limit) => fetchPosts(page, limit, tags, postsMetadata)}
        initialItems={initialItems.items}
        customKey={initialItems.key}/>
    </Fragment>
  );
}

function getPathWithoutTag(tag, tags) {
  let tagsQuery = tags.reduce((acc, val, i) => {
    if (val !== tag) {
      if (!!acc) {
        acc += '+';
      }
      acc += val;
    }
    return acc;
  }, '')
  if (tagsQuery) {
      tagsQuery = `?tags=${tagsQuery}`;
  }
  return '/' + tagsQuery;
}

function renderTags(tags, iconNames) {
  return tags.map((tag, index, arr) => {
    return (
      <Tag key={tag}>
        <a href={getPathWithoutTag(tag, arr)}>
          <Icon name={iconNames.TIMES} baseline={true}></Icon>
        </a>
        &nbsp;{tag}
      </Tag>
    );
  });
}

function fetchPosts(page, limit, tags, postsMetadata) {
  const startIndex = page * limit;
  return Promise.resolve(
    postsMetadata.posts
      .filter(item => tags.length === 0 || tags.some(tagToMatch => item.tags.includes(tagToMatch)))
      .sort((a, b) => compareDesc(a.publishDate, b.publishDate))
      .filter((_val, index) => index >= startIndex && index < startIndex + limit)
      .map(item => {
        return {
          id: item.guid,
          title: item.title,
          description: item.description,
          pubDate: item.publishDate,
          link: '/posts/'
        };
      })
  )
}

export async function getStaticProps() {
  const defaultItems = await fetchPosts(0, batchSize, '', Metadata);
  return { props: { publicUrl: process.env.PUBLIC_URL, postsMetadata: Metadata, iconNames: IconNames, defaultItems } }
}

export default withRouter(Blog);