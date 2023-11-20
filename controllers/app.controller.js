const {selectEndpoints} = require('../models/app.model.js')

exports.getEndpoints = (req,res,next)=>{
    selectEndpoints()
        .then((endpoints)=>{
            res.status(200).send({endpoints})
    })
    .catch(next)
}