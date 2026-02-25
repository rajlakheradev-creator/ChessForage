const express = require('express');
const mongoose=require("mongoose");
const path = require('path');
const cors=require("cors");
require("dotenv").config();
const app = express();
const authroutes=require("./routes/auth");
const PORT = 5000;

// 1. Serve Static Files (HTML, CSS, JS) from the root folder
app.use(express.static(__dirname));

// 2. Serve Sounds specifically (optional, but keeps your existing logic safe)
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MANGO_URI).then(()=>console.log("Mongo db connected")).catch(err=>console.log(err));
app.use("/api/auth",authroutes);
// 3. Fallback: Send index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});