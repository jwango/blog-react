# Getting Started

## Overview

### Tech stack

layer      | technology
---------- | ----------
data store | mongo
api        | express
frontend   | react, next.js
toolchain  | node, next.js

## Database
The app runs on mongo, which means that you will need to setup a mongo instance. I prefer to create both a local mongo instance with the cli, as well as host a *secure* public instance in something like mLab. To keep your database secure, the server-side code pulls the connection string from the environment variables, never hardcoding the value.

Once you have created a basic db within your instance, go ahead and set the environment variable `MONGODB_DB=<db-name>`.
Then run `posts:manage` with the `create` command to create the posts collection. From there you can write posts and manage them, as described in the `Content Management` section below.

## Environment

variable     | value(s) or `<type>`        | description
------------ | --------------------------- | -----------
`NODE_ENV`   | "development", "production" | affects pruning and how the server is run (watch vs built artifacts)
`MONGODB_DB` | `<string>`                  | the name of your db in mongo
`MONGODB_URI`| `<string>`                  | the connection string formatted as `mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]`
`PUBLIC_URL` | `<url>`                     | the root url of the app (the api and the page routes must live on this same root url)
`DISQUS_URL` | `<url>`                     | the disqus url for embedding the comments section

## Running Locally

Set the proper environment variables (see `Environment` above).

### Development
1. Set `NODE_ENV="development"`
2. Run `npm run dev`

### Production
1. Set `NODE_ENV="production"`
2. Run `npm run build`
3. Run `npm run start` 

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

## Compiling Posts
To compile posts, edit the whitelist in post.config.json. It has the following structure:
```json
{
  "outputFile":"./mock/data.js",
  "posts": [
    {
      "guid": "string",
      "title": "string",
      "author": { "_id": "string", "name": "string" },
      "tags": ["tag 1", "tag 2"],
      "filePath": "./mock/posts/mypost.md"
    }
  ]
}
```
The `outputFile` field must align with the imported JSON file in `upload-posts.js`.
Run `npm run posts:build`.

## Managing Posts
Once your posts have been compiled, you can manage your posts:
1. Set the environment variable `MONGODB_DB=mydb`
2. Set the environment variable `MONGODB_URI=mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]`
3. Run `npm run posts:manage`


The following commands are supported:

command  | description
-------- | -----------
`exit`   | exit gracefully
`read`   | read a specific post by id
`upload` | upload a specific post by id (cross-referencing the compiled posts)
`delete` | delete a specific post by id
`drop`   | drop the posts collection
`create` | create the posts collection

## Syndicating Posts
Anytime you update your posts, you may want to re-syndicate them for RSS feeds:
1. Set the environment variable `MONGODB_DB=mydb`
2. Set the environment variable `MONGODB_URI=mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]`
3. Set the environment variable `PUBLIC_URL=https://<your-app>.herokuapp.com`
4. Double check the `syndicate.config.json`
5. Run `npm run posts:syndicate`

Take the generated output file (as specified in the config) and update the rss.xml on your site.


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
- [ ] Clean-up mocks and client side files
- [ ] Clean-up console errors
- [ ] Support PWA experience
- [x] Expand custom theming and tooling