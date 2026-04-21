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

const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/store", storeRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/foods', foodRoutes);
app.use("/api/cart", cartRoutes);

//app.use(express.static(path.join(__dirname, '../frontend')));
const frontendPath = path.resolve(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
  /*res.sendFile(path.join(__dirname, '../frontend/loginZ.html'));
});*/
const loginFile = path.join(frontendPath, 'homeScreenX.html');
    res.sendFile(loginFile, (err) => {
        if (err) {
            console.error("Cannot find loginZ.html at:", loginFile);
            res.status(200).send("Server is alive, but frontend file is missing at the expected path.");
        }
    });
});


app.listen(port, "0.0.0.0",() => {
  console.log("Server running on port " + port);
});