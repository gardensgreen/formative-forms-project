const express = require("express");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const app = express();
const csrfProtection = csrf({cookie: true});


const port = process.env.PORT || 3000;

const users = [
    {
        id: 1,
        firstName: "Jill",
        lastName: "Jack",
        email: "jill.jack@gmail.com",
    },
];

app.set("view engine", "pug");
app.use(cookieParser());

app.get("/", (req, res) => {
    // res.send("Hello World!");
    res.render("index", { users });
});

app.get("/create", csrfProtection, (req, res, next) => {
    res.render("create", { csrfToken: req.csrfToken() })

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
