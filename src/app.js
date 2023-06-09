
// imports
const express = require("express");
const session = require("./configs/session.js");
const passport = require("./configs/passport.js");
const database = require("./configs/database.js");


// routers
const loginRouter = require("./routes/login.js");
const registerRouter = require("./routes/register");
const clubRouter = require("./routes/clubs.js");
const eventRouter = require("./routes/events.js");
const userRouter = require("./routes/users.js");
const postRouter = require("./routes/posts.js");
const pagesRouter = require("./routes/pages.js");


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


// load routers
app.use("/query", userRouter);
app.use("/query", postRouter);
app.use("/query", eventRouter);
app.use("/query", clubRouter);
app.use(loginRouter);
app.use(registerRouter);
app.use(pagesRouter);


// start server
database.checkConnection();
app.listen(port);




