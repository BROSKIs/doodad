import express from "express"

const app = express();

app.set("view engine", "ejs");

const PORT = 3005;

app.get("/", (req,res)=>{
    res.render("home");
});

app.listen(PORT, ()=>{
    console.log(`Your website is running at http://localhost:${PORT}`);
});