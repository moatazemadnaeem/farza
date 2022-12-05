const nodemailer=require('nodemailer')

const SendEmail=(email,uniqueString)=>{

    const Transport=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'moatazemad772@gmail.com',
            pass:process.env.NODEMAILERPASS
        },
    })
    const mailOptions={
        from:'moatazemad772@gmail.com',
        to:email,
        subject:'Email confirmation',
        text:`Please Press This Link https://mushy-cow-lapel.cyclic.app/api/users/verfiy-user/${uniqueString} to verify your email. Thanks`
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