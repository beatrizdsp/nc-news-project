const {selectArticleById,fetchCommentsById} = require('../models/articles.model')


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
    const {comments} = req.params
    fetchCommentsById().then((comments)=>{
        console.log(comments);
        res.status(200).send({comments})
    })
}