const db = require("../db/connection");

const { checkExists } = require("../db/seeds/utils");

exports.fetchArticles = (topic, sort_by = 'created_at', order = 'DESC') => {
  const allowedSortBys = [
    'article_id',
    'title',
    'author',
    'topic',
    'created_at',
    'votes',
    'article_img_url',
    'comment_count',
  ];
  const allowedOrders = ['ASC', 'DESC'];
  if (!allowedSortBys.includes(sort_by)) {
    return Promise.reject({ status: 404, msg: "Not found" });

  }
  if (!allowedOrders.includes(order)) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }

  let queryString = `
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
    ON comments.article_id = articles.article_id
    `;

  const queryValues = [];

  const processQueries = () => {
    if (topic) {
      return checkExists("topics", "slug", topic)
        .then(() => queryString += `WHERE articles.topic = $1 `)
        .then(() => {
          queryValues.push(topic);
        });
    }
    return Promise.resolve();
  };
  return processQueries()
    .then(() => {
        queryString += `GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order}`
      return db.query(queryString, queryValues);
    })
    .then(({rows}) => {
        return rows
    })
};

exports.selectArticleById = (article_id) => {
    queryString = (`
    SELECT 
    articles.*, 
    COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
    `)
    return db.query(queryString,[article_id])
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({status:404, msg:'this article does not exist'})
        }
        return rows[0]
    })
}

exports.addCommentForArticle = (article_id, newComment) => {
  const { username, body } = newComment;
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  const queryString = `
    INSERT INTO comments
    (author,body,article_id)
    VALUES ($1,$2,$3)
    RETURNING *
    `;
  return db
    .query(queryString, [username, body, article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.fetchCommentsById = (article_id) => {
  return db
    .query(
      ` SELECT * 
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateArticleById = (inc_votes, article_id) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  queryString = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `;
  return db.query(queryString, [inc_votes, article_id]).then(({ rows }) => {
    return rows[0];
  });
};
