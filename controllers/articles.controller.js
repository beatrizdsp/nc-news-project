const {selectArticleById,fetchArticles} = require('../models/articles.model')

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
    .catch((err)=>{
        console.log(err,'Article not found');
        next(err)
    })
   
}
