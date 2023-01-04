# ![RealWorld Example App](logo.png)

> ### [CellularJS](https://github.com/cellularjs/cellularjs) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a backend application built with **CellularJS** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the [**CellularJS**](https://github.com/cellularjs/cellularjs) community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# Getting started
- Open `.env` file, replace `DB_HOST=localhost` with `DB_HOST=db`.
- Run `docker-compose up`
- Follow this link for API testing: https://realworld-docs.netlify.app/docs/specs/backend-specs/introduction

# What is stage 1?
```
Stage 0: At this stage, the main purpose is making things done. You can access directly into other bounded context for getting data, ...

Stage 1: Application can run on the same server but database schema and code are in their bounded context/domain. The cost for choosing this architecture style is not cheap, if you don't need microservices, stage 0 is fine.  

Stage X: ...
```
This repository shows you how your application will look like when developing in stage 1 with CellularJS.

# Licence
MIT