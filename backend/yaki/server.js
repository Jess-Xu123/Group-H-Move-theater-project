const express = require("express");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const path = require('path');

const app = express();
app.use(express.json());

app.use(cors());
app.use("/users", userRoutes);

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Login.html'));
});

app.listen(3000, () => {
    console.log("server is on http://localhost:3000");
});