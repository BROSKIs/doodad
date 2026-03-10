import express from "express"

const app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true}));

const PORT = 3005;

const contacts = [];

const users = []

// home page (nav)
app.get("/", (req,res)=>{
    res.render("home");
});

// login page (nav)
app.get("/login", (req, res) => {
    res.render("login");
});

// sign up page (nav)
app.get("/sign-up", (req, res)=>{
    res.render("sign-up");
});

// contact us (nav)
app.get("/contact", (req, res)=>{
    res.render("contact");
});

// post-sign-up page
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

// post-contact page
app.post("/contact-submitted", (req, res)=>{
    const contact = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    };

    contacts.push(contact);

    res.render("conf-contact");
})

// post-login page
app.post("/logged-in", (req, res) => {
    res.render("home");
});

// access admin page for contacts
app.get("/admin-contact", (req, res)=>{
    res.send(contacts);
});

// access admin page for users
app.get("/admin-users", (req, res)=>{
    res.render('admin-users', { users });
});

app.listen(PORT, ()=>{
    console.log(`Your website is running at http://localhost:${PORT}`);
});