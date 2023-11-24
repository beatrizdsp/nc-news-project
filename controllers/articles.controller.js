
const {selectArticleById,fetchArticles,fetchCommentsById, addCommentForArticle,updateArticleById} = require('../models/articles.model')

const {checkExists} = require('../db/seeds/utils')

exports.getArticles = (req,res,next) => {
    const {topic,sort_by,order} = req.query
        fetchArticles(topic,sort_by,order)
        .then((articles)=> res.status(200).send({articles}))
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

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username} = req.body;
    const newComment = req.body;

    checkExists('articles', 'article_id', article_id)
        .then(() => checkExists('users', 'username', username))
        .then(()=> addCommentForArticle(article_id, newComment))
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch(next);
};

exports.patchArticleById = (req,res,next) => {
   
    const {article_id} = req.params
    const{inc_votes}= req.body
    
    return checkExists('articles','article_id',article_id)
    .then(()=> updateArticleById(inc_votes,article_id))
    .then((article)=>{ 
        res.status(200).send({article})
        })
    .catch(next)
}
