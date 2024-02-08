const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');

const authRouter = require('./router/auth');
const blogsRouter = require('./router/blogs');
const testRouter = require('./router/test');
const roughRouter = require('./router/rough');

//middlewares
app.use(express.json());
app.use(cors(corsOptions));

// routes
app.use('/auth',authRouter);
app.use('/blogs',blogsRouter);
app.use('/test', testRouter);
app.use(verifyJWT);
app.use("/rough", roughRouter);

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