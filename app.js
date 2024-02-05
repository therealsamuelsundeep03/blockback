const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const corsOptions = require('./config/corsOptions');

const authRouter = require('./router/auth');
const blogsRouter = require('./router/blogs');

//middlewares
app.use(express.json());
app.use(cors(corsOptions));

// routes
app.use('/auth',authRouter);
app.use('/blogs',blogsRouter);

// connecting to the database
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("connected to the database");
    })
    .catch((err) => {
        console.log(`Error in connecting to the database::`, err);
    });


app.listen(process.env.PORT || 8080, () => {
    console.log(`app is listening the port ${process.env.PORT || 8080}`)
})