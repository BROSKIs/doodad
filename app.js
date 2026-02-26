import express from "express"

const app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true}));

const PORT = 3005;

const contacts = [];

app.get("/", (req,res)=>{
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/contact", (req, res)=>{
    res.render("contact");
});

app.get("/contact-submited", (req, res)=>{
    const contact = {
        name: req.query.name,
        email: req.query.email,
        message: req.query.message
    };

    contacts.push(contact);

    res.render("conf-contact");
})

app.listen(PORT, ()=>{
    console.log(`Your website is running at http://localhost:${PORT}`);
});