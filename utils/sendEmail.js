const nodemailer=require('nodemailer')

const SendEmail=(email,uniqueString)=>{

    const Transport=nodemailer.createTransport({
        service:'gmail',
        secure:true,
        port:465,
        auth:{
            user:'moatazemad772@gmail.com',
            pass:'zztkerbucknnsjiw'
        },
        host:'smtp.gmail.com'
    })
    const mailOptions={
        from:'moatazemad772@gmail.com',
        to:email,
        subject:'Email confirmation',
        html:`Press <a href=http://localhost:9000/verfiy/${uniqueString}>Here</a> to verify your email. Thanks`
    }
    Transport.sendMail(mailOptions,function(err,res){
        if(err){
            console.log('Error',err)
        }else{
            console.log('Response',res)
        }
    })
}
module.exports={SendEmail}