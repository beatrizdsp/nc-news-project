const {selectArticleById,fetchArticles, addCommentForArticle} = require('../models/articles.model')
const {checkExists} = require('../db/seeds/utils')

exports.getArticles = (req,res,next) => {
    fetchArticles().then((articles)=>{
        res.status(200).send({articles:articles})
    })
}

exports.getArticleById = (req,res,next) => {
    const {article_id} = req.params
    selectArticleById(article_id)
    .then((articleById)=>{
        res.status(200).send({article:articleById})
    })
    .catch(next)
}

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username} = req.body;
    const newComment = req.body;

    checkExists('articles', 'article_id', article_id)
        .then(() => checkExists('users', 'username', username))
        .then(() =>
         addCommentForArticle(article_id, newComment))
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch(next);
};