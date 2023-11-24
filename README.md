# Northcoders News API

**Bea's News - Back End API**

Built by Beatriz Pardington November 2023

---

**Back-end**
---
Link to hosted version of this project: https://nc-news-qmmk.onrender.com/api

Link to Github repository: https://github.com/beatrizdsp/nc-news-project

**Description**
---

This News API is an examle of a RESTful API written in JavaScript using node.js, an express.js server and PostgreSQL as a database.

As a user you can interact with the news database using the following methods:

- GET a list of all avaialble endpoints 
 - GET a list of topics
 - GET a list of users
- GET a list of articles, witht he ability to filter by topic
- GET an specific article, with the ability to get comments from a specific article
- POST a comment for a specific article
- DELETE a specific comment
- UPDATE a specific article

**Setup Requirements**
---

**Installation Requirements**

- Node.js v20
- PostgreSQL v16

 Any versions prior to this have not been tested and thus may not work

**Cloning this repo in CLI**

- Clone this reposoitory using `git clone https://github.com/beatrizdsp/nc-news-project`

**Installing depenedencies**

Install any dependenacies via `npm install`

These are the devendencies:
- express 4.x
- pg 8.x
- pg-format 1.x
- dotenv 16.x

These are the dev dependencies
- husky 8.x
- jest 27.x
- jest-extended 2.x
- jest-sorted 1.x
- supertest 6.x

**Environment set-up**

You will need to create two files for this project at the root:
```
- .env.test 
- .env.development 
```

Into each of these add `PGDATABASE=` with the correct database name i.e  `nc_news_test` or `nc_news`

These file already dealt with in the `.gitignore`

**Database setup and seeding**

Run the following commands `npm run setup-dbs` and `npm run seed`

**Testing**

This API has been tested using Jest and Supertest. 
To run tests use the following command `npm test`





