import express from "express"
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import multer from "multer";
import { validateContact, validateItem } from "./validate.js";

const app = express();
//FILE UPLOAD SET UP 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/') // Make sure this folder exists!
  },
  filename: function (req, file, cb) {
    // Keeps the original filename + current date to avoid overwriting
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''))
  }
});

const upload = multer({
    storage: storage,
    dest: 'uploads/',
    limits: { 
        fileSize: 5 * 1024 * 1024 // 1 MB limit
    }
}).single('itemImage');

dotenv.config();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));

const PORT = 3005;

// internal storage for contacts
const contacts = [];

//internal storage for items
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
app.get("/", async (req,res)=>{
    try {
        // fetch all users
        const sql = 'SELECT * FROM items';
        const [items_feed] = await pool.query(sql);
        // render page
        res.render("home", { items_feed },);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading item: ' + err.message);
    }
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

// contact us (nav)
app.get("/contact", (req, res)=>{
    res.render("contact");
});

// post-contact page (submission)
app.post("/contact-submitted", async (req, res)=>{
    try {
        // validation function
        const contact = req.body;
        let valid = validateContact(contact);

        // throws user back to contact page if inputs are invalid
        if (!valid.isValid) {
            console.log(valid);
            res.render('contact', {errors: valid.errors});
            return;
        }
    
    console.log("New support ticket submitted", contact);

    const sql = `INSERT INTO contacts(name, email, message) VALUES (?, ?, ?);`;
    
    const params = [
        contact.name || '',
        contact.email || '',
        contact.message || ''
    ];

    const result = await pool.execute(sql, params);
    console.log('Saved ticket with ID:', result[0].insertId);

    res.render('conf-contact');
    } catch (err) {
        console.error('Error submitting support ticket:', err);
        res.status(500).send('Oops! We\'re unable to save your support ticket. Please try again.');
    }
})

// access admin page for contacts
app.get("/admin-contact", async (req, res)=>{
    try {
        const [contacts] = await pool.query('SELECT * FROM contacts ORDER BY timestamp DESC');
        res.render('admin-contacts', { contacts });
    }  catch (err) {
        console.error('Error accessing support tickets:', err);
        res.status(500).send('Error loading support tickets from contacts: ' + err.message);
    }
        
});

// ITEM CREATING
app.get("/create-item", (req, res)=>{
    res.render("create_item");
});

// item submission
app.post("/item-confirmation", async (req, res)=>{
    try {
        //file UPLOADER
        upload(req, res, async (err) => {
            const item = req.body;

            const valid = validateItem(item);
            
            if (!valid.isValid) {
                console.log("Not valid: ",valid);
                res.render('create_item', { errors: valid.errors });
                return;
            }

        if (err instanceof multer.MulterError) {
            return res.status(400).send("File too large! Limit is 1MB.");
            } else if (err) {
            return res.status(500).send("An unknown error occurred.");
            }
            const filePath = req.file.path; 
            // get item information
           

            console.log('New item listed created:', item);

            item.img = filePath.substring(6);

            // SQL
            const sql = `INSERT INTO items(name, img, email, price, item_desc) VALUES (?, ?, ?, ?, ?);`;

            // includes some preventative measures against null values.
            const params = [
                item.name || '',
                filePath.substring(6) || 'Pasha Fix This',//SHOULD NEVER HAPPEN IF PAGE IS PROPERLY VALUATED
                item.email || '',
                item.price || '',
                item.desc || ''
            ];

            const result = await pool.execute(sql, params);
            res.render("item-conf", { item: item });
        });
    } catch (err) {
        console.error('Error saving item:', err);
        res.status(500).send('Item information failed to save. Please try listing your item again.');
    }
})

// retrieve listing
app.get("/item", async (req, res)=>{
    const id = req.query.id;
    try {
        // fetch all listings with ID
        const sql = 'SELECT * FROM items WHERE id = ' + id;
        const [item] = await pool.query(sql);
        if(typeof item[0] === "undefined"){
            return res.status(404).send("Error 404: listing doesn't exisit");
        }
        // render page
        res.render("item", { item: item[0] },);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading item: ' + err.message);
    }
});

// sold listing
app.get("/item-purchased", async (req, res)=>{
    const id = req.query.id;
    try {
        // mark listen as sold on the back end
        const sqlOne = 'UPDATE items SET sold = TRUE WHERE id = ' + id + ';'
        const itemOne = await pool.query(sqlOne);
        // fetch all listings with ID
        const sql = 'SELECT * FROM items WHERE id = ' + id;
        const [item] = await pool.query(sql);
        // render page
        res.render("sold", { item: item[0] },);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading item: ' + err.message);
    }
});


app.listen(PORT, ()=>{
    console.log(`Your website is running at http://localhost:${PORT}`);
});


