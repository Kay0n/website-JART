/* eslint-disable no-console  */

// imports
const express = require("express");
const session = require("./configs/session.js");
const passport = require("./configs/passport.js");
const database = require("./configs/database.js");



// routers
const loginRouter = require("./routes/login.js");
const registerRouter = require("./routes/register");
const queryRouter = require("./routes/query.js");




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
            <a href="/query/user">User query tester</a><br>
            <a href="/query/manager">Manager query tester</a><br>
            <a href="/auth/logout">Logout</a>
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



// load routers
app.use("/query", queryRouter);
app.use(loginRouter);
app.use(registerRouter);



// start server
database.checkConnection();
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});




