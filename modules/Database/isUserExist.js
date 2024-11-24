import mongoose from "mongoose";


const isUserExist = async (username, Model) =>{
    let user = await Model.findOne({name : username});
    if (user){
        return true;
    } else {
        return false;
    }
}

export default isUserExist