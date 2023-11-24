const request = require("supertest");
const app = require("../app/app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const listOfEndpoints = require("../endpoints.json");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("GET /api", () => {
  test("/api status 200: responds with the endpoint avaialble using the endpoints.json file", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("endpoints");
        expect(body.endpoints).toEqual(listOfEndpoints);
      });
  });
});

describe("GET/api/topics", () => {
  test("status:200 responds with a 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("status:200: should return an array of objects with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        expect(
          topics.every((topic) => {
            const slug = topic.hasOwnProperty("slug");
            const description = topic.hasOwnProperty("description");
            return slug && description;
          })
        ).toEqual(true);
      });
  });
  test("Error 404: returns an error 404 for a route that does not exist", () => {
    return request(app)
      .get("/api/invalidpath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe('GET /api/users',()=>{
    test('GET 200 /api/users - should return a status 200 with a array of objects of all users',()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body})=>{
            const {users} = body
            expect(users).toHaveLength(4)
            expect(Array.isArray(users)).toBe(true)
            expect(users[0]).toBeInstanceOf(Object)
        })
    })
    test('GET 200 /api/users - should return a status 200 with an array of objects with properties of: username, name and avatar_url ',()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body})=>{
            const {users} = body
            expect(users).toHaveLength(4)
            users.forEach((user)=>{
                expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
            })
        })
    })
    test("GET 404 /api/users: returns an error 404 for a route that does not exist", () => {
        return request(app)
          .get("/api/use")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
})

describe("GET /api/artciles/:articleid", () => {
  test("should return a status 200 with an array for a given article id", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article).toMatchObject(
          {
            article_id: 9,
            title: "They're not exactly dogs, are they?",
            topic: "mitch",
            author: "butter_bridge",
            body: "Well? Think about it.",
            created_at: "2020-06-06T09:10:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        );
      });
  });
  test("GET: 404 sends an 404 status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("this article does not exist");
      });
  });
  test("GET: 400 sends an 400 status and error message when given a invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
})
describe('UPDATED with comment_count GET /api/articles/:article_id',()=>{
    test("should return a status 200 with an array for a given article id, including a comment_count property", () => {
        return request(app)
          .get("/api/articles/9")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toBeInstanceOf(Object);
            expect(body.article).toMatchObject(
              {
                article_id: 9,
                title: "They're not exactly dogs, are they?",
                topic: "mitch",
                author: "butter_bridge",
                body: "Well? Think about it.",
                created_at: "2020-06-06T09:10:00.000Z",
                votes: 0,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                comment_count: '2'
              },
            );
          });
      });
})

  describe("Get /api/articles", () => {
    test("GET: 200 sends an 200 status", () => {
      return request(app).get("/api/articles").expect(200);
    });
    test("GET: 200 returns a body of articles", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body }) => {
          expect(body.articles).toHaveLength(13);
          body.articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.title).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("string");
          });
        });
    });
    test("GET 200 /api/articles - tests are sorted by date by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });

  test("GET 200 /api/articles/topic - returns an array of articles that fall under the given topic", () => {
    return request(app)
      .get("/api/articles")
      .query('topic=mitch')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        articles.forEach((article)=>{
            expect(article.topic).toEqual('mitch')
        })
      });
  });
  test("GET 200 /api/articles/topic - returns an empty array when that a topic contains no articles", () => {
    return request(app)
      .get("/api/articles")
      .query('topic=paper')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(0)
        expect(articles).toEqual([])
      });
  });
  test("GET 404 /api/articles/topic - sends an 404 status and error message when given a topic that does not exist", () => {
    return request(app)
      .get("/api/articles")
      .query('topic=dog')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not found')
      });
  });

});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET /api/articles/:article_id/comments - 200: returns an array of comments of an given id, ordered by most recent first", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET /api/articles/:article_id/comments - status 200: returns an array of comments for a given article-id with the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("GET /api/articles/:article_id/comments 404: sends an 404 status and error message when given a valid but non-existent id ", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("GET /api/articles/:article_id/comments 400: sends an 400 status and error message when given a invalid id ", () => {
    return request(app)
      .get("/api/articles/:not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET /api/articles/:article_id/comments 200: sends an 200 status when given a valid article id with no comments assigned ", () => {
    return request(app)
      .get("/api/articles/11/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});



   
describe('POST /api/articles/:article_id/comments',()=>{
    test('201 - /api/articles/:article_id/comments: should add a new comment ',()=>{
        const newComment = {
            username: 'icellusedkars',
            body: 'This article is a disgrace'
        }
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(201)
        .then(({body})=>{
            const {comment} = body
            expect(typeof comment.comment_id).toBe('number')
            expect(typeof comment.body).toBe('string')
            expect(typeof comment.author).toBe('string')
            expect(typeof comment.article_id).toBe('number')
            expect(typeof comment.votes).toBe('number')
            expect(typeof comment.created_at).toBe('string')
        })
    })
    test('201 - /api/articles/:article_id/comments: newComment should contain the correct author,comment_id and body values',()=>{
        const newComment = {
            username: 'icellusedkars',
            body: 'This article is a disgrace'
        }
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(201)
        .then(({body})=>{
            const {comment} = body
            expect(comment).toEqual(
                expect.objectContaining({
                    comment_id:19,
                    author: 'icellusedkars',
                    body: 'This article is a disgrace'
                })
            )
        })
    })
    
    test('400 - /api/articles/:article_id/comments: returns 400 error for a comment with incorrect properties is posted',()=>{
        const newComment = {
            username: 'icellusedkars'
        }
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad request')
        })
    })
    test('404 - /api/articles/:article_id/comments: returns 404 error for a comment an invalid username',()=>{
        const newComment = {
            username: 'fake_username',
            body: 'this is a scammer'
        }
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Not found')
        })
    })
    test('400 - /api/articles/:article_id/comments: returns 400 error for an invalid article_id',()=>{
        const newComment = {
            username: 'icellusedkars',
            body: 'This article is a disgrace'
        }
        return request(app)
        .post('/api/articles/:not-an-id/comments')
        .send(newComment)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad request')
        })
    })
    test('404 - /api/articles/:article_id/comments: returns 404 error for a comment an invalid article_id',()=>{
        const newComment = {
            username: 'fake_username',
            body: 'this is a scammer'
        }
        return request(app)
        .post('/api/articles/999/comments')
        .send(newComment)
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Not found')
        })
    })
})


  describe("PATCH /api/articles/:article_id", () => {
  test("200 /api/articles/:article_id should return a 200 status", () => {
    const update = { inc_votes: 11 };
    return request(app).patch("/api/articles/9").send(update).expect(200);
  });
  test("200 /api/articles/:article_id should update the votes of an article for a given id", () => {
    const update = { inc_votes: 11 };
    return request(app)
      .patch("/api/articles/9")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(body.article).toMatchObject({
          article_id: 9,
          title: "They're not exactly dogs, are they?",
          topic: "mitch",
          author: "butter_bridge",
          body: "Well? Think about it.",
          created_at: "2020-06-06T09:10:00.000Z",
          votes: 11,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200 should return an article where the votes have been updated when the existing votes are greater than 0", () => {
    const update = { inc_votes: -200 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: -100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH: 404 sends an 404 status and error message when given a valid but non-existent id", () => {
    const update = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/999")
      .send(update)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("PATCH: 400 sends an 400 status and error message when given a invalid id", () => {
    const update = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/-not-an-id")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH: 400 sends an 400 status and error message when given a invalid data type in the object", () => {
    const update = { inc_votes: "five" };
    return request(app).patch("/api/articles/1").send(update);
  });
  test("PATCH: 400 sends an 400 status and error message when given an empty object as a body", () => {
    const update = {};
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});


describe('DELETE /api/comments/:comment_id',()=>{
    test('DELETE 204 - shoudl return a 204 error for a given comment_id and no content',()=>{
        return request(app)
        .delete('/api/comments/3')
        .expect(204)
    })
   test('DELETE 404 - should repsond with an appropriate status and error message when given an valid but non-existent id',()=>{
    return request(app)
    .delete('/api/comments/999')
    .expect(404)
    .then(({body})=>{
        expect(body.msg).toBe('Not found')
    })
   })
   test('DELETE 400 - should respond with an appropriate status and error message when given an invalid id',()=>{
    return request(app)
    .delete('/api/comments/comment-five')
    .expect(400)
    .then(({body})=>{
        expect(body.msg).toBe('Bad request')
    })
   })
})
