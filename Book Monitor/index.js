import express from "express";
import bodyParser from "body-parser";
import pg from "pg"



const app = express();
const port = 3000;





const db = new pg.Client({
   user : "postgres",
  host : "localhost",
    database :"bookstracker",
    password : "123456",
    port : 5432

}) 

db.connect();

async function gettingbooks(){
    const result = await db.query("SELECT * FROM books ORDER BY ID ASC;")
    return result
}

app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static("public"))

app.get("/", async(req,res)=>{
    //  const result = await db.query("SELECT * FROM books;")
    //  console.log(result.rows)
    const data = (await gettingbooks()).rows
   console.log(( data))
    res.render("index.ejs",{
       
        data : data
    })
})

app.get("/new",(req,res)=>{
    
    res.render("new.ejs")
})
app.get("/home",(req,res)=>{
    res.redirect("/")
})

app.post("/add",async(req,res)=>{
    const id = req.body.id;
    const isbn = req.body.isbnNo;const bName = req.body.bName;const bAuthor =req.body.aName;
    const bDescrip = req.body.describtion ; const bRating = req.body.bRating ;const bDate = req.body.bdate
     console.log(isbn,bName,bAuthor,bDescrip,bRating,bDate)
    await db.query("INSERT INTO books VALUES($1,$2,$3,$4,$5,$6,$7);",[
        id,isbn,bName,bAuthor,bDescrip,bRating,bDate
    ])
    res.redirect("/")
})

app.post("/edit",async(req,res)=>{
    const id =req.body.id

    const result = await db.query("SELECT id,book_name,book_author,book_description,book_rating,book_duration FROM books WHERE id= $1;",[
        id,
    ])
    console.log(result.rows , req.body.id)
    if (result.rows.length > 0) {
        res.render("edit.ejs", {
            data: result.rows[0] // Pass the first book object to the template
        });
    } else {
        // Handle the case where no book is found with the given ID
        res.send("Book not found");
    }
})

app.post("/update",async(req,res)=>{
    const id = req.body.id
    const bName = req.body.bName;const bAuthor =req.body.aName;
    const bDescrip = req.body.description ; const bRating = req.body.bRating ;const bDate = req.body.bdate
    await db.query("UPDATE books SET (book_name,book_author,book_description,book_rating,book_duration) = ($1,$2,$3,$4,$5) WHERE id = $6 ;",[
        bName,bAuthor,bDescrip,bRating,bDate,id
    ])
    res.redirect("/")
})

app.post("/delete",async(req,res)=>{
    console.log(req.body.id)
    await db.query("DELETE FROM books WHERE id = $1;",[
        req.body.id
    ])
    console.log(req.body.id)
    res.redirect("/")
    
})



app.listen(port, ()=>{
    console.log(`http://localhost:${port}`)
})
 