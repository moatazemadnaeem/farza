const handelerr=(err,req,res,next)=>{
    let transformed;
    let errtransformed;
    transformed=err.summary()
    let generic_message='';
    transformed.forEach((item,index)=>{
        if(transformed.length-1===index){
            generic_message+=`(${item.field}): ${item.message}`

        }else{
            generic_message+=`(${item.field}): ${item.message} And `
        }
    })
    errtransformed={errors:transformed,statusCode:err.statusCode,status:false,generic_message}
    return res.status(err.statusCode).send(errtransformed)
}
module.exports={handelerr}