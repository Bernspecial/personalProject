const express = require("express");
const bodyParser = require('body-parser');
const mongodb = require("./Dbase/connection");
const route = require("./routes/indexroute");

const app = express();

const port = process.env.PORT || 5050;
app.use(bodyParser.json());

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
