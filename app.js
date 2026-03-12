import express from "express"
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
const app = express();

dotenv.config();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));

const PORT = 3005;

// internal storage for contacts
const contacts = [];

// interal storage for users
const users = []

// secret connection pool for secret databases
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

// home page (nav)
app.get("/", (req,res)=>{
    res.render("home");
});

// database testing route for debugging
app.get('/db-test', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.send(users[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message); 
    }
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
        lname: req.body.lname,
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
    res.render('admin-contacts', { contacts });
});

// access admin page for users
app.get("/admin-users", async (req, res)=>{
    try {
        // fetch all users
        const [users] = await pool.query('SELECT * FROM users ORDER BY timestamp DESC');
        // render page
        res.render('admin-users', { users });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: ' + err.message);
    }
    
});

app.listen(PORT, ()=>{
    console.log(`Your website is running at http://localhost:${PORT}`);
});