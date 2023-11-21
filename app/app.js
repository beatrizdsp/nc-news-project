const express = require('express')
const{getTopics} = require('../controllers/topics.controller')
const {getEndpoints} = require('../controllers/app.controller')
const {getArticleById} = require('../controllers/articles.controller')
const{handle404s,handleServerErrors,handleCustomErrors} = require('../errors/errors')

const app = express()

app.get('/api',getEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.all('*',handle404s)

app.use(handleCustomErrors)

app.use(handleServerErrors)


module.exports = app