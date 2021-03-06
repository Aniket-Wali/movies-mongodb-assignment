const express = require('express');

const router = require('./router');
const connect = require('./configDB/connectDB');

const PORT = process.env.PORT || 3000;


const app = express();

// using a middleware
app.use(express.json());

// connecting to the database
connect();

app.get('/', (req, res) => {
    res.json({
        success : true,
        message : "Welcome to the express server"
    });
});

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});