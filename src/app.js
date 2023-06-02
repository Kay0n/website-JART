/* eslint-disable no-console  */

// imports
const express = require("express");
const session = require("./configs/session");
const passport = require("./configs/passport.js");
const database = require("./configs/database.js");



// routers
const authRouter = require("./routes/auth.js");



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
            <a href="/auth/logout">Logout</a>
        `;
    } else {
        authMessage = `
            <h2>Not Authenticated.</h2>
            <a href="/auth/login">Sign in</a><br>
            <a href="/auth/register">Register</a>
        `;
    }

    res.send(authMessage);
});



// load routers
app.use("/auth", authRouter);



// start server
database.checkConnection();
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});




