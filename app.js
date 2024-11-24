//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import connectDb from "./modules/Database/connectDb.js";
import readItem from "./modules/Database/readItems.js";
import insertItem from "./modules/Database/insertItem.js";
import deleteItem from "./modules/Database/deleteItem.js";
import isUserExist from "./modules/Database/isUserExist.js";
import lodash from "lodash";

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];
const workItems = [];



const itemSchema = {
  name: {
    type: String,
    required: true
  }
}
const listSchema = {
  name : {
    type: String,
    required: true
  },
  items: [itemSchema]
}

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "click on + to add item"
});

const item2 = new Item({
  name: "<--- click to delete item"
});
const item3 = new Item({
  name: "you can add user by taping url/user_name"
});

const defaultList = [item1, item2, item3];



app.get("/", async function (req, res) {
  await connectDb(true);
  items = await readItem(Item);
  await connectDb(false);
  res.render("list", { listTitle: "Today", newListItems: items });
});

app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // Send a 204 No Content response
});

app.post("/", async function (req, res) {
  await connectDb(true);
  const item = req.body.newItem;
  const listName = lodash.capitalize(req.body.list);
  if (listName === "Today") {
    await insertItem(Item, item);
    res.redirect("/");
  } else {
    const list = await List.find({ name: listName });
    await List.updateOne({name : listName},{
      $push: {
        items : {
          name : item
        }
      }
    });

    res.redirect("/" + listName);
    
  }
  await connectDb(false);
});

app.post("/delete",async (req,res)=>{
  await connectDb(true);
   const id = req.body.checkbox;
   const listTitle = req.body.listTitle;

   if(listTitle === "Today"){
      await deleteItem(Item,id);
   res.redirect("/");
   }else  {
    await List.updateOne({name : listTitle},{
      $pull: {
        items : {
          _id : id
        }
      }
    });
    res.redirect("/" + listTitle);
   }
 
   await connectDb(false);
})

app.get("/:customList", async function (req, res) {
  await connectDb(true);
  const customList = lodash.capitalize(req.params.customList);
  
  const found = await isUserExist(customList,List);

  if(found){
    const list = await readItem(List, customList);
    res.render("list", { listTitle: customList, newListItems: list.items });
  }else{

    const list = new List({
      name: customList,
      items: defaultList
  });
    await list.save();
    res.redirect(`/${customList}`);
  }

  await connectDb(false);
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
