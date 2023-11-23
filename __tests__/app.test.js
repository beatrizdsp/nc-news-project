const request = require('supertest')
const app = require('../app/app')
const seed = require('../db/seeds/seed')
const db = require('../db/connection.js')
const testData = require('../db/data/test-data/index.js')
const listOfEndpoints = require('../endpoints.json')
const { string } = require('pg-format')

afterAll(()=>{
    db.end()
});

beforeEach(()=>{
    return seed(testData)
})

describe('GET /api',()=>{
    test('/api status 200: responds with the endpoint avaialble using the endpoints.json file',()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body})=>{
            expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty('endpoints');
            expect(body.endpoints).toEqual(listOfEndpoints);
        })
    })
})


describe('GET/api/topics',()=>{
test('status:200 responds with a 200 status code',()=>{
    return request(app)
    .get('/api/topics')
    .expect(200)
})
test('status:200: should return an array of objects with slug and description properties',()=>{
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body})=>{
            const {topics} = body
            expect(topics).toHaveLength(3)
            expect(
                topics.every((topic)=>{
                    const slug = topic.hasOwnProperty('slug')
                    const description = topic.hasOwnProperty('description')
                    return slug && description
                })
            ).toEqual(true)
        })
})
test('Error 404: returns an error 404 for a route that does not exist',()=>{
    return request(app)
    .get('/api/invalidpath')
    .expect(404)
    .then(({body})=>{
        expect(body.msg).toBe('Not found')
    })
})
})
describe('GET /api/artciles/:articleid',()=>{
    test('should return a status 200 with an array for a given article id',()=>{
        return request(app)
        .get('/api/articles/9')
        .expect(200)
        .then(({body})=>{
            expect(body.article).toBeInstanceOf(Object)
            expect(body.article).toMatchObject([{
                article_id : 9,
                title: "They're not exactly dogs, are they?",
                topic: "mitch",
                author: "butter_bridge",
                body: "Well? Think about it.",
                created_at: '2020-06-06T09:10:00.000Z',
                votes: 0,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            }])
        })
    })
    test('GET: 404 sends an 404 status and error message when given a valid but non-existent id',()=>{
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('this article does not exist')
        })
    })
    test('GET: 400 sends an 400 status and error message when given a invalid id',()=>{
        return request(app)
        .get('/api/articles/not-an-article')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad request')
        })
    })

    describe('Get /api/articles',()=>{
        test('GET: 200 sends an 200 status',()=>{
            return request(app)
            .get('/api/articles')
            .expect(200)
        })
        test('GET: 200 returns a body of articles',()=>{
            return request(app)
            .get('/api/articles')
            .then(({body})=>{
                expect(body.articles).toHaveLength(13)
                body.articles.forEach((article)=>{
                    expect(typeof article.article_id).toBe('number');
                    expect(typeof article.title).toBe('string');
                    expect(typeof article.author).toBe('string');
                    expect(typeof article.topic).toBe('string');
                    expect(typeof article.created_at).toBe('string');
                    expect(typeof article.votes).toBe('number')
                    expect(typeof article.article_img_url).toBe('string')
                    expect(typeof article.comment_count).toBe('string')
                })
            })
        })
        test('/api/articles - tests are sorted by date by default',()=>{
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body})=>{
                const {articles} = body
                expect(articles).toBeSortedBy('created_at',{descending:true})
            })
        })
    })
})

describe('GET /api/articles/:article_id/comments',()=>{
    test('GET /api/articles/:article_id/comments - 200: returns an array of comments of an given id, ordered by most recent first',()=>{
    return request(app)
    .get('/api/articles/5/comments')
    .expect(200)
    .then(({body})=>{
        const {comments} = body
        expect(comments).toBeInstanceOf(Array)
        expect(comments).toBeSortedBy('created_at',{descending:true})
    })
})
test('GET /api/articles/:article_id/comments - status 200: returns an array of comments for a given article-id with the correct properties',()=>{
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({body})=>{
        const {comments} = body
        expect(comments).toHaveLength(11)
        comments.forEach((comment)=>{
            expect(typeof comment.comment_id).toBe('number')
            expect(typeof comment.votes).toBe('number')
            expect(typeof comment.created_at).toBe('string')
            expect(typeof comment.author).toBe('string')
            expect(typeof comment.body).toBe('string')
            expect(typeof comment.article_id).toBe('number')
        })
    })
})
test('GET /api/articles/:article_id/comments 404: sends an 404 status and error message when given a valid but non-existent id ',()=>{
    return request(app)
    .get('/api/articles/999/comments')
    .expect(404)
    .then(({body})=>{
        expect(body.msg).toBe('Not found')
    })
})
test('GET /api/articles/:article_id/comments 400: sends an 400 status and error message when given a invalid id ',()=>{
    return request(app)
    .get('/api/articles/:not-an-id/comments')
    .expect(400)
    .then(({body})=>{
        expect(body.msg).toBe('Bad request')
    })
})
test('GET /api/articles/:article_id/comments 200: sends an 200 status when given a valid article id with no comments assigned ',()=>{
    return request(app)
    .get('/api/articles/11/comments')
    .expect(200)
    .then(({body})=>{
        expect(body.comments).toEqual([])
    })
})
})
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