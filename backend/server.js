require("dotenv").config();

const express = require("express");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const storeRoutes = require("./routes/storeRoutes");
const movieRoutes = require("./routes/movieRoutes");
const foodRoutes = require("./routes/foodRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cors = require("cors");
const path = require('path');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/store", storeRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/foods', foodRoutes);
app.use("/api/cart", cartRoutes);

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/loginZ.html'));
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});