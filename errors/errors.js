exports.handlePsqErrors = (err,req,res,next)=>{
    const errors = ['22P02', '23502']
    if(errors.includes(err.code)){
        res.status(400).send({msg:'Bad request'})
    }else{
        next(err)
    }
}

exports.handleCustomErrors = (err,req,res,next)=>{
    if(err.status){
        res.status(err.status).send({msg:err.msg})
    }
    else{
        next(err)
    }
}
exports.handle404s = (req,res) =>{
    
res.status(404).send({msg: 'Not found'}).next(err)
}


exports.handleServerErrors = (err,req,res)=>{
    if(err.status) console.log(err);
        res.status(500).send({msg:'Internal Server Error'})
    
}
