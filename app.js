const express = require("express");
const bodyParser = require('body-parser');
const mongodb = require("./Dbase/connection");
const route = require("./routes/indexroute");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

const app = express();

const port = process.env.PORT || 5050;
app.use(bodyParser.json());

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))
    .use(passport.initialize())
    .use(passport.session())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept, Z-Key");
    res.setHeader("Access-Control-Allow-Method", "GET, POST, PUT, DELETE, OPTIONS");
    next();
})
    .use(cors({ methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"] }))
    .use(cors({ origin: "*" }))
    .use("/", route);

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    function (accessToken, refreshToken, profile, done) {
        //User.findOrCreate({githubId: profile.id}, function (err, user) {
        return done(null, profile);
        // });
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get("/", (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")
});

app.get("/github/callback", passport.authenticate("github", {
    failureRedirect: "/api-docs", session: false
}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect("/");
    });

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`App connected to database and listening on ${port}`);
        });
    }
});
