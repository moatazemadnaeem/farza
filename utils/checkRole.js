const {roles}=require('../types/roles')

const checkRole=(InputRole)=>{
  
    if(InputRole===roles.ADMIN){
        return false;
    }
  
    if(roles[InputRole]){
        return true;
    }
    return false;

}

module.exports={checkRole}