const express = require('express')
const{getTopics} = require('../controllers/topics.controller')
const {getEndpoints} = require('../controllers/app.controller')
const {getArticleById,getCommentsByArticleId,getArticles} = require('../controllers/articles.controller')
const{handle404s,handleServerErrors,handleCustomErrors,handlePsqErrors} = require('../errors/errors')

const app = express()

app.get('/api',getEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.all('*',handle404s)

app.use(handlePsqErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)


module.exports = app