
// imports
const express = require("express");


// init vars
const app = express();
const port = 8080;


// serve static files in "/public"
app.use(express.static("src/public"));


// home route
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "src/pages" });
});


// start server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});




