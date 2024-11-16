const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const routes = require("./routes/index");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine('ejs', ejsMate);

main()
    .then(() => {
        console.log("Mongodb Connected Successfully");
    })
    .catch((err) => {
        console.log("Error", err.message);
    });

async function main() {
    await mongoose.connect("mongodb+srv://user:BJTf1CGtNhMXR2Hp@deliverymgmtcluster.nnozz.mongodb.net/?retryWrites=true&w=majority&appName=DeliveryMgmtCluster");
}

// Use routes
app.use(routes);

app.listen(8080, () => {
    console.log("App Listening on port 8080");
});
