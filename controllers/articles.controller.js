const {selectArticleById} = require('../models/articles.model')

exports.getArticles = (req,res,next) => {
    console.log(req);
}

exports.getArticleById = (req,res,next) => {
    const {article_id} = req.params
    selectArticleById(article_id)
    .then((articleById)=>{
        console.log(articleById);
        res.status(200).send({article:articleById})
    })
    .catch((err)=>{
        console.log(err,'Article not found');
        next(err)
    })
   
}
