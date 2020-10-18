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
    const { firstName, lastName, email, password } = req.body;

    console.log(req.body);
    if (!firstName) errors.push("Please fill out the first name field.");
    if (!lastName) errors.push("Please fill out the last name field.");
    if (!email) errors.push("Please fill out the email field.");
    if (!password) errors.push("Please fill out the password field.");

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
    res.render("create", { csrfToken: req.csrfToken() });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
