/* eslint-disable no-console  */

// imports
const express = require("express");
const session = require("./configs/session.js");
const passport = require("./configs/passport.js");
const database = require("./configs/database.js");



// routers
const loginRouter = require("./routes/login.js");
const registerRouter = require("./routes/register");




// express setup
const app = express();
const port = 8080;
app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// session middleware
app.use(session);
app.use(passport.initialize());
app.use(passport.session());



// home route
app.get("/", (req,res) => {

    let authMessage;
    if(req.isAuthenticated()){
        authMessage = `
            <h2>Authenticated! Welcome ${req.user.given_name}</h2>
            <a href="/logout">Logout</a>
        `;
    } else {
        authMessage = `
            <h2>Not Authenticated.</h2>
            <a href="/login">Sign in</a><br>
            <a href="/register">Register</a>
        `;
    }

    res.send(authMessage);
});
app.get('/pages/userSettings', (req, res) => {
    res.sendFile("userSettings.html", { root: "src/pages" });
});

app.get('/pages/myClubs', (req, res) => {
    res.sendFile("myClubs.html", { root: "src/pages" });
});

app.get('/pages/club', (req, res) => {
    if (req.isAuthenticated()){
        res.sendFile("Club.html", { root: "src/pages" });
    }

    res.sendFile("NVclub.html", { root: "src/pages" });
});

app.get('/pages/explore', (req, res) => {
    if (req.isAuthenticated()){
        res.sendFile("explore.html", { root: "src/pages" });
    }

    res.sendFile("NVexplore.html", { root: "src/pages" });
});
// load routers
app.use(loginRouter);
app.use(registerRouter);



// start server
database.checkConnection();
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});




