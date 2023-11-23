const {removeCommentById} = require('../models/comments.model')

const {checkExists} = require('../db/seeds/utils')

exports.deleteCommentById = (req,res,next)=>{
    const {comment_id} = req.params
    console.log(comment_id);
    removeCommentById(comment_id).then(()=>{
      res.status(204).send()
        
    })
    .catch((err)=>{
        console.log(err, 'error removing comment');
        next(err)
    })
}