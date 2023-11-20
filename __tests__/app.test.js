const request = require('supertest')
const app = require('../db/app/app.js')
const seed = require('../db/seeds/seed.js')
const db = require('../db/connection.js')
const testData = require('../db/data/test-data/index.js')

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