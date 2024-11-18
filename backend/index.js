const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./router/route');
const db = require('./Database/db');


const app = express();
db.dbConnect(process.env.DB_URL);

app.use(express.json());
app.use(cors());
app.use('/api/v1' , router);

app.get('/' , (req,res) => {
    return res.status(200).json({
        status: 1,
        message: "Service is live",
    })
})

app.listen(process.env.PORT , () => {
    console.log("App is listening on port 3000");
})