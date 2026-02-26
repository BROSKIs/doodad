import express from "express"

const app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));

const PORT = 3005;

app.get("/", (req,res)=>{
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.listen(PORT, ()=>{
    console.log(`Your website is running at http://localhost:${PORT}`);
});