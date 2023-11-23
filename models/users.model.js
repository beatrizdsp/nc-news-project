const db = require('../db/connection')

exports.fetchUsers = () => { 
   queryString = (`
   SELECT * 
   FROM users
   `)
   return db.query(queryString).then(({rows})=>{
    return rows
   })
}