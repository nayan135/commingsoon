const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        await client.connect();
        const database = client.db('userDB');
        const collection = database.collection('users');
        const user = await collection.findOne({ username, password });
        if (user) {
            req.session.user = username;
            res.send('Login successful');
        } else {
            res.send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});

app.post('/signup', async (req, res) => {
    const { name, surname, username, password } = req.body;
    try {
        await client.connect();
        const database = client.db('userDB');
        const collection = database.collection('users');
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            res.send('Username already exists');
        } else {
            await collection.insertOne({ name, surname, username, password });
            res.send('Signup successful');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});

app.get('/main.html', (req, res) => {
    if (req.session.user) {
        res.sendFile(__dirname + '/public/main.html');
    } else {
        res.redirect('/login.html');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});