import mongoose from "mongoose"

const readItem = async (Model, customItem) => {
    if (customItem) {
        const items = await Model.findOne({name : customItem});
        return items;
    }else{
        const items = await Model.find();
        return items;
    }
    
    
}

export default readItem;