# Decisions
This documents the evolution of the project through major decision points.

## [01/12/2019] MERN Stack, Create-React-App (CRA)

## [01/13/2019] Server Side Rendering & CRA Ejection

## [00/00/0000] Post Document Structure & Serialization

## [05/03/2020] Next.js

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