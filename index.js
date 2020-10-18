const express = require("express");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const app = express();
const csrfProtection = csrf({ cookie: true });

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
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // res.send("Hello World!");
    res.render("index", { users });
});

app.get("/create", csrfProtection, (req, res, next) => {
    res.render("create", { csrfToken: req.csrfToken() });
});

let idCount = 1;
app.post("/create", csrfProtection, (req, res) => {
    const errors = [];
    const {
        firstName,
        lastName,
        email,
        password,
        confirmedPassword,
    } = req.body;

    if (!firstName) errors.push("Please provide a first name.");
    if (!lastName) errors.push("Please provide a last name.");
    if (!email) errors.push("Please provide an email.");
    if (!password) errors.push("Please provide a password.");
    if (password !== confirmedPassword) {
        errors.push(
            "The provided values for the password and password confirmation fields did not match."
        );
    }

    const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
    };

    if (errors.length > 0) {
        res.render("create", { user, errors, csrfToken: req.csrfToken() });
        return;
    }

    idCount++;
    user.id = idCount;

    users.push(user);
    res.redirect("/");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
