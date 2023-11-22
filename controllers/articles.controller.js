const {selectArticleById,fetchCommentsById,fetchArticles} = require('../models/articles.model')

exports.getArticles = (req,res,next) => {
    fetchArticles().then((articles)=>{
        res.status(200).send({articles:articles})
    })
    .catch(next)
}

exports.getArticleById = (req,res,next) => {
    const {article_id} = req.params
    selectArticleById(article_id)
    .then((articleById)=>{
        res.status(200).send({article:articleById})
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req,res,next) => {
    const {article_id} = req.params
    return checkExists('articles','article_id',article_id)
    .then(()=>{
        fetchCommentsById(article_id)
        .then((comments)=>{
            res.status(200).send({comments})
        })
        })
    .catch(next)
}

