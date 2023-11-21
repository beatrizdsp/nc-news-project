const request = require('supertest')
const app = require('../app/app')
const seed = require('../db/seeds/seed')
const db = require('../db/connection.js')
const testData = require('../db/data/test-data/index.js')
const listOfEndpoints = require('../endpoints.json')

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
        expect(body.msg).toBe('Page not found')
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
            expect(body.article).toMatchObject({
                article_id : 9,
                title: "They're not exactly dogs, are they?",
                topic: "mitch",
                author: "butter_bridge",
                body: "Well? Think about it.",
                created_at: '2020-06-06T09:10:00.000Z',
                votes: 0,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
        })
    })
})