import express from "express"

const app = express();

const PORT = 3005;

app.get("/", (req,res)=>{
    app.render("home");
});

app.listen(PORT, ()=>{
    console.log(`Your website is running at http://localhost:${PORT}`);
});