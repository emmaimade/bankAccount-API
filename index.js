const express = require('express');
require('dotenv').config();
const connectDB = require('./config/dbConfig');

const app = express();

const port = process.env.PORT;

// connect to database
connectDB();

app.use(express.json());

// routes
app.use("/v1/account/", require("./routes/v1/account"));
app.use("/v1/auth/", require("./routes/v1/auth"));
app.use("/v1/transaction/", require("./routes/v1/transaction"));

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
})