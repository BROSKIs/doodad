import express from "express"

const app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true}));

const PORT = 3005;

const contacts = [];

const users = []

//IN NAVBAR
app.get("/", (req,res)=>{
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/sign-up", (req, res)=>{
    res.render("sign-up");
});

app.get("/contact", (req, res)=>{
    res.render("contact");
});
//NOT IN NAVBAR
app.post("/new-account", (req,res)=>{
    const user = {
        fname: req.body.fname,
        lname: req.body.fname,
        email: req.body.email,
        password: req.body.pass
    }
    users.push(user);

    res.render("new-account", { user });
});


app.post("/contact-submitted", (req, res)=>{
    const contact = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    };

    contacts.push(contact);

    res.render("conf-contact");
})

app.get("/admin", (req, res)=>{
    res.send(contacts);
});

app.listen(PORT, ()=>{
    console.log(`Your website is running at http://localhost:${PORT}`);
});