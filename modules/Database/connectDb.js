import mongoose from "mongoose";

const connectDb = async (connect) =>{
    if(connect){
      await mongoose.connect("mongodb+srv://techbooster-admin:Akash-techbooster23@cluster0.71gel.mongodb.net/todolistDB");
    }else{
      await mongoose.connection.close();
    }
}

export default connectDb;