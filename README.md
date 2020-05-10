# Getting Started

## Overview

### Tech stack

layer      | technology
---------- | ----------
frontend   | react, next.js
toolchain  | node, next.js

## Environment

variable     | value(s) or `<type>`        | description
------------ | --------------------------- | -----------
`NODE_ENV`   | "development", "production" | affects pruning and how the server is run (watch vs built artifacts)
`PUBLIC_URL` | `<url>`                     | the root url of the app as used for page metadata and syndication
`DISQUS_URL` | `<url>`                     | the disqus url for embedding the comments section

## Running Locally

Set the proper environment variables (see `Environment` above).
Anytime you change `NODE_ENV` be sure to re-install node modules - ideally by deleting old node modules and re-installing with `npm run install`.

### Development
1. Set `NODE_ENV="development"`
2. Run `npm run dev`

### Production as Next.js Server
1. Set `NODE_ENV="production"`
2. Run `npm run build`
3. Run `npm run start` 

### Production as Exported Static Website
Install `http-server` globally via `npm run install -g http-server` to serve up local files.
1. Set `NODE_ENV="production"`
2. Run `npm run export`
3. Run `http-server ./out`

### Emulate Heroku
1. Set `NODE_ENV="production"`
2. Remove `node_modules`
4. Run `npm install`
5. Run `npm run heroku-postbuild`
6. Run `npm prune`
7. Run `npm run start` 

## Customization

Now that you are able to get up and running, let's make this thing your own!

### Brand
* replace `public/favicon.ico` with your own icon that supports 4 sizes: `64x64`, `32x32`, `24x24`, `16x16`
* replace `mask-icon.svg` with your own icon that is black to support Safari tabs
* replace `app-icon.png` with a `180x180` image for use as a progressive web app
* replace `banner.png` with a custom banner, used as a default image in og:image metadata; maintain `1.91:1` ratio with recommended minimum size `1200x630`
* determine a color theme for primary and secondary colors - keep the hex values on hand
  - duplicate `styles/themes/_theme-default.scss`
  - update your colors at the top of your new theme scss file
  - rename `.app--default` to a new name like `.app--my-new-theme`
  - update `styles/themes/_theme.scss` to reference the new theme file
  - update `_app.js` to use the new theme class `.app--my-new-theme`
  - see the dark theme to see how this can be re-skinned

### Metadata
* update `public/manifest.json` with your new primary theme color
* update `components/head-custom/head-custom.component.js`
  - change `defaultAuthor`, `themeColor`, `siteName`, etc...
  - change file paths for icons and banners as needed
* update `app.json` for heroku with new name
* update `cms/syndicate.config.json` with new title and description for rss feeds

### Existing pages
* update default page header and title in `pages/_app.js`
  - change `<title></title>` to reflect your default page title
  - change `<h1>blog-react</h1>` to reflect your new site header and name
* update page `<HeadCustom>` overrides in all pages
  - `pages/index.js` (home, statically rendered)
  - `pages/about.js` (about, statically rendered)
  - `pages/posts/[id].js` (each post, dynamically rendered)
* update `pages/about.js` to describe yourself
  - use the existing layout or make a custom layout as you like - it's all html and scss

# Content Management

## Write Posts
This blog builds posts from source `markdown` files, stored at `cms/posts`. Add any new post source files you want here. Then move onto `Managing Posts`.

## Managing Posts
Once your posts have been written, you can manage your posts by running `npm run posts:manage`.
The following commands are supported:

command   | description
---------  | -----------
`exit`    | exit gracefully
`list`    | list all posts
`read`    | read a specific post by id
`publish` | stages a post for publication; allows for updating existing and creating new posts
`delete`  | stages a post for deletion
`save`    | saves all staged posts

## Syndicating Posts
Anytime you update your posts, you may want to re-syndicate them for RSS feeds. If you use `npm run export` or `npm run heroku:postbuild` then this is done for you.
1. Set the environment variable `PUBLIC_URL=https://www.your-website.com`
4. Double check the `syndicate.config.json`
5. Run `npm run posts:syndicate`

Take the generated output file (as specified in the config) and update the rss.xml on your site. The default output should be in the public folder so it won't need to be moved manually.

# Development

## To do:
- [x] Add error component  
- [x] Render error component for missing pages or data  
- [x] Re-theme header sizes  
- [x] Re-theme blog metadata  
- [ ] Add blog post loading state  
- [x] Change archive to blog scene  
- [x] Re-theme feed item  
- [x] Re-theme feed loading state  
- [x] Re-theme pins  
- [x] Build About scene  
- [x] Build Archive scene  
- [x] Add /posts/meta endpoint for Archive  
- [x] Generalize data fetching for feed component  
- [x] Build footer  
- [x] Remove old comment component and logic  
- [x] Integrate Disqus for comments  
- [x] Add RSS generator  
- [x] Escape REGEX string for link definitions  
- [x] Revisit link definitions and labels  
- [x] Migrate to new CRA / build system without ejecting (Next.js)
- [x] Refactor server to use controller and service model  
- [x] Add service injection modelling for DI lookup  
- [x] Hook up /posts endpoint to use DB data  
- [x] Add env switch to configure services  
- [x] Remove filepath from upload script  
- [x] Add guid to syndication  
- [x] Add tags endpoints  
- [x] Add tags scene  
- [x] Change icon  
- [x] Address multi-instantiation of mongo singleton  
- [ ] Clean-up console errors
- [ ] Support PWA experience
- [x] Expand custom theming and tooling