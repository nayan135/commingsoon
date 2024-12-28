const { MongoClient } = require('mongodb');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

dotenv.config();

const app = express();
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const allowedOrigins = [
    'http://blog.nayanacharya.info.np',
    'https://commingsoon-51lfhwjs1-nayan135s-projects.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.post('/api/login', async (req, res) => {
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

module.exports = app;