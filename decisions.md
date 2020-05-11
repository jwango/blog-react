# Decisions
This documents the evolution of the project through major decision points. Everything written before `Static Generation` is in hindsight, but I do my best to stay assume the past perspective. As such, they are still written in the present tense.

## [01/12/2019] MERN Stack, Create-React-App (CRA)
Having already worked with Angular on a professional basis, I want to branch out and learn patterns in other frontend frameworks. React is of particular interest because of it's popularity, as well as it's almost fundamental differences from Angular. Angular is developed by Google. React was first created by Facebook. Angular is opionated and comes with a comprehensive toolchest. React is minimal and comes with the fundamental building blocks. Angular must be minimzed with opt-out features. React must be maximized with opt-in features.

Ultimately I decided on React because it was different, popular, and more importantly lightweight. Additionally there is a focus on functional programming, component purity, and higher-order-components - concepts that you would be hard-pressed to find in an enterprise Angular project. I decided to use Create-React-App given that it is one of the most popular React toolchains - it might as well be the "default one".

Since I'll be working within Node.js and JavaScript anyways, I plan to utilize Mongo for my data store as well as Express.js for the api. It will be the classic MEAN stack but with React instead of Angular.

## [01/13/2019] Server Side Rendering & CRA Ejection
I've quickly decided that I want to support the goodness of SEO and to reject the shallow-linking of Single Page Applications. Or if I must, I want to at least fully render the blog posts for page indexing and crawling. In order to better customize this experience, I will have the eject from the CRA ecosystem. Unfortunately this means that I cannot inherit newer versions of this toolchain.

Despite guaranteed frustration, it will be worthwhile to learn a little more about the inner workings of webpack configs, babel transpiling, and everything inbetween. Plus I will be able to learn about React hydration, static contexts, and how exactly I can use React's native libraries to render server-side. An immediate gotcha that stands out is to be aware of XSS via corrupt data and HTML dynamic rendering. Since I already know I am going to write my posts in Markdown, I may write my own Markdown interpreter to encode the page in whitelisted HTML elements where I can better control the rendering.

## [05/03/2020] Next.js
After returning to the project in 2020, I have decided that the client side scripts have become more and more useless. Additionally it is frustrating to have to build the client before starting the server for SSR. As such I contemplated re-creating the app in the newest version of CRA and seeing if I might be able to NOT eject this time around while supporting SSR. Upon re-visting the list of recommended toolchains on the official React developer's guide, I found an entry for Next.js.

It's extremely encouraging to see so many new toolchains pop-up within the last year - it proves that React is continuing to grow and gain popularity and that I had made a good investment in the foundational framework of this app. Next.js seems to fit the bill - it supports SSR out of the gate as well as a custom app server structure with Express.js! It seems that Next.js relies heavily on the internal folder structure of the project - something I'm not extremely fond of since people organize their projects differently. I'm willing to comply if it means I don't have to deal with CRA again.

## [05/09/2020] Static Generation
It has been extremely satisfying to generate a proof of concept that operates mostly server-side for both rendering and for serving up an api. I wanted to create a SSR web app that was SEO compliant and eventually PWA compliant as well. Yet it has become apparent to me that with all these bells and whistles, the whole flow of post data and tags is rather contrived. In addition, options for hosting a node instance with SSL don't come *that* cheap. At the time of writing, simple applications (such as this) run around $7/mo to $10/mo - which raises the barrier for those who want to build a more serious website quickly and cheaply.

The logical compromise between a Next.js + Express.js app and a statically served app should be transitioning the Express api to serverless functions, which has become extremely popular (along with functional programming as a whole). For the sake of learning I may yet try this out, but ultimately static generation will do just as well if not better.

Gains:
1. No waiting for SSR - it's static!
2. No data store
    - eliminate ACID transaction concerns
    - eliminate potential backdoor
3. No API management
    - eliminate tedious CRUD endpoints
    - eliminate error handling and edge cases
    - eliminate potential backdoor for XSS
    - everything is simpler
4. Content management becomes simpler - upload step is cut out
5. Accessible to developers
    - static hosting is the simplest and cheapest
    - no server instance management

Costs:
1. Re-deploy if *anything* changes - whether the dynamic post content or any of the core app
2. Number of files to deploy grows linearly with each post
3. Large refactor of the Feed and tagging mechanics

On the whole this will accomplish two majors goals: lowering the barrier to production and drastically decreasing the complexity of the system.