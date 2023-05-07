
// imports
const express = require('express');


// init vars
const app = express();
const port = 8080;


// home route
app.get('/', (req, res) => {
    res.send('Hello World!');
});


// start server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});






