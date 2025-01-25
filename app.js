const express = require("express");
const bodyParser = require('body-parser');
const mongodb = require("./Dbase/connection");
const route = require("./routes/indexroute");

const app = express();

const port = process.env.PORT || 5050;
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept, Z-Key");
    res.setHeader("Access-Control-Allow-Method", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use("/", route);

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`App connected to database and listening on ${port}`);
        });
    }
});
