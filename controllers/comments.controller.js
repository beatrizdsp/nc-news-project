const {removeCommentById} = require('../models/comments.model')

const {checkExists} = require('../db/seeds/utils')

exports.deleteCommentById = (req,res,next)=>{
    const {comment_id} = req.params
    return checkExists('comments','comment_id',comment_id)
    .then(()=>removeCommentById(comment_id))
    .then(()=>res.status(204).send())
    .catch(next)
}