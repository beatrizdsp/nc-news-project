const express = require('express')

const {getEndpoints} = require('../controllers/app.controller')

const topicsRouter = require('./topics.router')
const usersRouter = require('./users.router')
const articlesRouter = require('./articles.router')
const commentsRouter = require('./comments.router')

apiRouter = express.Router()


apiRouter.use('/articles', articlesRouter)

apiRouter.use('/comments',commentsRouter)

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/users',usersRouter)

apiRouter.get('/', getEndpoints)

module.exports = apiRouter