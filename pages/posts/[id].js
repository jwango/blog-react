import { useEffect } from 'react';

import format from 'date-fns/format';
import parse from 'date-fns/parse';
import fs from 'fs';

import HeadCustom from '../../components/head-custom/head-custom.component';
import MdFragment from '../../components/md-fragment/md-fragment.component';
import Tag from '../../components/tag/tag.component';
import Time from '../../components/time/time.component';

import Published from '../../cms/out/published.json';
import Metadata from '../../cms/out/metadata.json';

const parseMarkdown = require('../../lib/utils/parse.util');

function Post({ postDataStr, disqusUrl, publicUrl }) {
  const postData = JSON.parse(postDataStr);

  const title = postData.title || 'Untitled';
  const description = postData.description || '';
  const chunks = postData.body || [];
  const lastUpdateDate = getFormattedDate(postData.lastUpdateDate) || '?';
  const pubDate = getFormattedDate(postData.publishDate) || '?';
  const tags = postData.tags || [];
  const guid = postData.guid;
  const canonUrl = {
    baseUrl: publicUrl,
    relUrl: `/solutions/${guid}`
  };

  useEffect(() => {
    if (disqusUrl) {
      const dTitle = title;
      const dId = guid;
      const dCanonUrl = canonUrl;
      window.disqus_config = function () {
        this.page.title = `${dTitle}-${dId}`;
        this.page.identifier = dId;
        this.page.url = `${dCanonUrl.baseUrl}${dCanonUrl.relUrl}`;
      };

      const s = document.createElement('script');
      s.src = disqusUrl;
      s.setAttribute('data-timestamp', +new Date());
      (document.head || document.body).appendChild(s);
    }
  }, []);

  const keywords = [
      'blog',
      'react',
      'framework',
      'jwango',
      ...tags
  ];
  return (
      <article className='post'>
          <HeadCustom
              title={title}
              description={description}
              keywords={keywords.join(', ')}
              baseUrl={canonUrl.baseUrl}
              relUrl={canonUrl.relUrl}>
          </HeadCustom>
          <header>
              <h1>{title}</h1>
              <Time dateTime={pubDate}></Time>
              {renderLastUpdateDate(pubDate, lastUpdateDate)}
          </header>
          <section className='post__content'>
              <MdFragment chunks={chunks} pinDepth={3}/>
          </section>
          <footer className='blog__footer'>
              {renderTags(tags)}
              <div id='disqus_thread'></div>
              <noscript>Please enable JavaScript to view the <a href='https://disqus.com/?ref_noscript'>comments powered by Disqus.</a></noscript>
          </footer>
      </article>
  );
}

function getFormattedDate(dateStr) {
  if (dateStr) {
    return format(parse(dateStr), 'MMM D, YYYY');
  }
  return dateStr;
}

function renderLastUpdateDate(publishDate, lastUpdateDate) {
  if (publishDate === lastUpdateDate || !lastUpdateDate) {
    return null;
  }
  return <><span className='color-background-faded'> • </span><Time dateTime={lastUpdateDate}></Time></>;
}

function renderTags(categories) {
  if (categories) {
    return categories.map((category) => {
      return (
        <Tag key={category} link={`/?tags=${category}`}>{category}</Tag>
      );
    });
  }
  return <span></span>;
}

export async function getStaticPaths() {
    const paths = Object.keys(Published).map(id => {
        return {
            params: { id }
        };
    });
    return {
        paths: paths,
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    const fileName = Published[params.id];
    if (!fileName) {
        return { props: {} };
    }
    const fileContent = await fs.promises.readFile(fileName, 'utf8');
    let lines = fileContent.split('\r\n');
    if (lines.length === 1) {
        lines = fileContent.split('\n');
    }
    const doc = parseMarkdown(lines);
    const metadata = Metadata.posts.find(post => post.guid === params.id) || doc.metadata;
    const postData = {
        guid: params.id,
        body: doc.chunks,
        ...metadata,
        tags: doc.metadata.tags.split(',').map(item => item.trim())
    };
    
    return { props: { postDataStr: JSON.stringify(postData), disqusUrl: process.env.DISQUS_URL || null, publicUrl: process.env.PUBLIC_URL } };
}

export default Post;