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
const users = [];

//intermal storage for items
const items = [];

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
        const users = await pool.query('SELECT * FROM login');
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
app.post("/new-account", async (req, res) => {
    try {
        // get user input
        const user = req.body;
        console.log('New user signed up:', user);

        // SQL injection? never heard of it.
        const sql = `INSERT INTO login(fname, lname, email, password) VALUES (?, ?, ?, ?);`;

        // includes some preventative measures against null values.
        const params = [
            user.fname || '',
            user.lname || '',
            user.email || '',
            user.pass || ''
        ];

        const result = await pool.execute(sql, params);
        console.log('User information saved with ID:', result[0].insertId);
        res.render("new-account", { user });
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Sorry! We failed to save your information. Please try signing up again.');
    }
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
        const [users] = await pool.query('SELECT * FROM login ORDER BY timestamp DESC');
        // render page
        res.render('admin-users', { users });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: ' + err.message);
    }
    
});
//ITEM CREATIONG
app.get("/create-item", (req, res)=>{
    res.render("create_item");
});
app.post("/item-comfirmation", (req, res)=>{

    const item = {
        img: req.body.img,
        name: req.body.name,
        price: req.body.price,
        desc: req.body.desc,
        timestamp: new Date()
    }

    items.push(item);

    res.render("item-conf", { item });
})

app.get("/item", (req, res)=>{
    const id = req.query.id;
    const item = items[id];
    res.render("item", { item },);
});


app.listen(PORT, ()=>{
    console.log(`Your website is running at http://localhost:${PORT}`);
});


