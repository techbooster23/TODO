import mongoose from "mongoose";

const deleteItem = async (Model, id) => {
     await Model.deleteOne({_id : id});
     console.log("Successfully deleted");
} 
export default deleteItem;