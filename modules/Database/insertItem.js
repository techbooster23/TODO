import mongoose from "mongoose";

const insertItem = async (Model,item) => {
    const note = new Model({
        name : item,
    });
   await note.save();
}

export default insertItem;