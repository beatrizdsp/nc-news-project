const db = require('../db/connection')

exports.selectArticleById = (article_id) => {

    queryString = (`
    SELECT * 
    FROM articles
    WHERE article_id = $1
    `)
    return db.query(queryString,[article_id])
    .then(({rows})=>{
        return rows[0]
    })
}