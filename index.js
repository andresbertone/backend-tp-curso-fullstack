require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./src/routes/index.js');


const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_DB_URL;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(router);

const connectDb = async () => {
    try{
        await mongoose.connect(MONGO_URL);
        console.log('Database connected');
        
        app.listen({port: PORT}, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Server running on: http://localhost:${PORT}/`);
        });
    }catch(error){
        console.log(`Error connecting to database: ${error}`);
    }
}

connectDb();