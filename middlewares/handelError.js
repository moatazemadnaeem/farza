const handelerr=(err,req,res,next)=>{
    let transformed;
    let errtransformed;
    transformed=err.summary()
    errtransformed={errors:transformed}
    return res.status(err.statusCode).send(errtransformed)
}
module.exports={handelerr}