const db = require('../db/connection')

exports.fetchArticles = ()=>{
    return db.query(`
    SELECT 
    articles.title,
     articles.author,
      articles.article_id,
       articles.topic,
        articles.created_at,
         articles.votes,
          articles.article_img_url,
           COUNT(comments.article_id) AS comment_count 
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY
    articles.title,
     articles.author,
      articles.article_id,
       articles.topic,
        articles.created_at,
         articles.votes,
          articles.article_img_url
    ORDER BY articles.created_at DESC
    `)
    .then(({rows})=>{
        return rows
    })
}

exports.selectArticleById = (article_id) => {

    queryString = (`
    SELECT * 
    FROM articles
    WHERE article_id = $1
    `)
    return db.query(queryString,[article_id])
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({status:404,msg:'this article does not exist'})
        }
        return rows
    })
}

exports.fetchCommentsById = (article_id)=>{

    return db.query(` SELECT * 
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `,[article_id]).then(({rows})=>{
        return rows
    })
}

exports.updateArticleById = (inc_votes,article_id) =>{

    if(!inc_votes){
        return Promise.reject({status:400,msg:'Bad request'})
    }
    queryString = (`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `)
    return db.query(queryString,[inc_votes,article_id]).then(({rows})=>{
        return rows[0]
    })
}