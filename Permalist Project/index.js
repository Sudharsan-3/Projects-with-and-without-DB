import express from "express";
import bodyParser from "body-parser";
import pg from  "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user : "postgres",
  host : "localhost",
  database : "permalist",
  password : "123456",
  port : 5432 

})

db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  // { id: 1, title: "Buy milk" },
  // { id: 2, title: "Finish homework" },
];

// async function titles(){
//   const result = await db.query("SELECT * FROM items RETURNING *");
//   // items.push(result)
//   result.rows.forEach((event)=>{
//     items.push(event)
//   })

// }
// titles()
app.get("/", async (req, res) => {
  
  let result = await db.query("SELECT * FROM items ORDER BY id ASC ;");
  items = (result.rows)
  console.log(result.rows)
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items(title) VALUES ($1) ;",[
    item
  ])
  items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  let id = req.body.updatedItemId;
  let title = req.body.updatedItemTitle;
  await db.query("UPDATE items SET title = ($1) WHERE id = ($2) ;",[
    title,
    id
  ]) ;
  console.log(id,title);
  res.redirect("/");

});

app.post("/delete", async(req, res) => {
  const id = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = $1 ;",[
    id
  ]);
  res.redirect("/")

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
