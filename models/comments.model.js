const db = require('../db/connection')


exports.removeCommentById = (comment_id)=>{
    
    queryString = (`
    DELETE FROM comments
    WHERE comment_id = $1
    `)
    return db
    .query(queryString,[comment_id])
    
}