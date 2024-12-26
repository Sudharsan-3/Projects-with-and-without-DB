import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/"
// HINTS:
// 1. Import express and axios

// 2. Create an express app and set the port number.

// 3. Use the public folder for static files.
app.use(express.static("public"))

// 4. When the user goes to the home page it should render the index.ejs file.
app.get("/",async(req,res)=>{
    try {
        const result = await axios.get(API_URL+"random");
        console.log(result.data)
        res.render("index.ejs", {secret : result.data , user : result.data});
      } catch (error) {
        res.render("index.ejs", { secret : error ,user : error});
      }
    });
    // const result = await axios.get(API_url)
    // console.log(result.data)
    // res.render("index.ejs")


// 5. Use axios to get a random secret and pass it to index.ejs to display the
// secret and the username of the secret.

// 6. Listen on your predefined port and start the server.
app.listen(port,(()=>{
    console.log(`Your server is running on the ${port}`)
}))