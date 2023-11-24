const express = require('express')

const {getArticleById,getArticles,getCommentsByArticleId, postCommentByArticleId,patchArticleById} = require('../controllers/articles.controller')

articlesRouter = express.Router()

articlesRouter
.get('/', getArticles)
.get('/:article_id', getArticleById)
.get('/:article_id/comments', getCommentsByArticleId)
.patch('/:article_id', patchArticleById)
.post('/:article_id/comments',postCommentByArticleId)

module.exports = articlesRouter