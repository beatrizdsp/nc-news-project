const express = require('express')
const{getTopics} = require('../controllers/topics.controller')
const {getEndpoints} = require('../controllers/app.controller')

const {getArticleById,getArticles,getCommentsByArticleId, postCommentByArticleId,patchArticleById} = require('../controllers/articles.controller')
 const {deleteCommentById} = require('../controllers/comments.controller')

const{handle404s,handleServerErrors,handleCustomErrors,handlePsqErrors} = require('../errors/errors')

const app = express()
app.use(express.json())

app.use(express.json())

app.get('/api',getEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.delete('/api/comments/:comment_id', deleteCommentById)


app.patch('/api/articles/:article_id', patchArticleById)


app.post('/api/articles/:article_id/comments',postCommentByArticleId)

app.all('/*',handle404s)

app.use(handlePsqErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)


module.exports = app