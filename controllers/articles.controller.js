const {selectArticleById,fetchCommentsById,fetchArticles} = require('../models/articles.model')

exports.getArticles = (req,res,next) => {
    fetchArticles().then((articles)=>{
        res.status(200).send({articles:articles})
    })
    .catch((err)=>{
        console.log(err,'Error getting articles');
        next(err)
    })
}

exports.getArticleById = (req,res,next) => {
    const {article_id} = req.params
    selectArticleById(article_id)
    .then((articleById)=>{
        res.status(200).send({article:articleById})
    })
    .catch((err)=>{
        console.log(err,'Article not found');
        next(err)
    })
}

exports.getCommentsByArticleId = (req,res,next) => {
    const {article_id} = req.params
    fetchCommentsById(article_id).then((comments)=>{
        res.status(200).send({comments})
        console.log(comments)
    })
    .catch((err)=>{
        console.log(err,'Article comments not found');
        next(err)
    })
}
