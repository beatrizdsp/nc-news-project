exports.handle404s = (req,res) =>{
    res.status(404).send({msg: 'Page not found'})
}

exports.handleServerErrors = (err,req,res)=>{
    if(err.status) console.log(err);
        res.status(500).send({msg:'Internal Server Error'})
    
}
