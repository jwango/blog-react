# Getting Started

## Database
The app runs on mongo, which means that you will need to setup a mongo instance. I prefer to create both a local mongo instance with the cli, as well as host a *secure* public instance in something like mLab. To keep your database secure, the server-side code pulls the connection string from the environment variables, never hardcoding the value.

Once you have created a basic db within your instance, go ahead and set the environment variable `MONGODB_DB=<db-name>`.
Then run `posts:manage` with the `create` command to create the posts collection. From there you can write posts and manage them, as described in the `Maintenance` section below.

## Running Locally
Since the app is server-side rendered, the app build follows these steps:
1. Build the client scripts with `npm run build:client`
2. Start the server with `npm run local:start`

# Maintenance

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
    },
    ...
  ]
}
```
The `outputFile` field must align with the imported JSON file in `upload-posts.js`.

If the build script has been updated, you must first run `npm run scripts:build`.
Then run `npm run posts:build`.

## Managing Posts
Once your posts have been compiled, you can manage your posts:
1. Set the environment variable `MONGODB_URI=mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]`
2. Run `npm run posts:manage`


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
1. Set the environment variable `MONGODB_URI=mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]`
2. Set the environment variable `PUBLIC_URL=https://<your-app>.herokuapp.com`
3. Double check the `syndicate.config.json`
4. Run `npm run posts:syndicate`

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
- [ ] Integrate Disqus for comments  
- [x] Add RSS generator  
- [x] Escape REGEX string for link definitions  
- [x] Revisit link definitions and labels  
- [ ] Sync webpack configs between server and client for compiling React code  
- [ ] Migrate to new CRA / build system without ejecting
- [x] Refactor server to use controller and service model  
- [x] Add service injection modelling for DI lookup  
- [x] Hook up /posts endpoint to use DB data  
- [x] Add env switch to configure services  
- [ ] Fix service workers  
- [x] Remove filepath from upload script  
- [x] Add guid to syndication  
- [x] Add tags endpoints  
- [x] Add tags scene  
- [x] Change icon  
- [x] Address multi-instantiation of mongo singleton  
- [ ] Clean-up mocks and client side files
- [ ] Clean-up console errors
