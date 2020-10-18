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

const validate = (req, res, next) => {
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
    req.errors = errors;

    req.user = {
        firstName,
        lastName,
        email,
        password,
        confirmedPassword,
    };

    next();
};

app.get("/", (req, res) => {
    // res.send("Hello World!");
    res.render("index", { users });
});

app.get("/create", csrfProtection, (req, res, next) => {
    res.render("create", { csrfToken: req.csrfToken() });
});

app.get("/create-interesting", csrfProtection, (req, res, next) => {
    let beatles = [
        { name: "John" },
        { name: "Paul" },
        { name: "Ringo" },
        { name: "George" },
    ];

    res.render("create-interesting", { beatles, csrfToken: req.csrfToken() });
});

let idCount = 1;
app.post("/create", csrfProtection, validate, (req, res) => {
    const errors = req.errors;

    const user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        password: req.user.password,
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

app.post("/create-interesting", csrfProtection, validate, (req, res) => {
    const errors = req.errors;
    const { age, favoriteBeatle, iceCream } = req.body;

    if (!age) errors.push("age is required");
    if (!(age > 0)) errors.push("age must be a valid age");
    if (age > 120 || age < 0) errors.push("age must be a valid age");

    if (!favoriteBeatle) errors.push("favoriteBeatle is required");
    if (!["John", "Paul", "Ringo", "George"].includes(favoriteBeatle)) {
        errors.push("favoriteBeatle must be a real Beatle member");
    }

    let iceCreamBool;
    if (iceCream === "on") {
        iceCreamBool = true;
    } else {
        iceCreamBool = false;
    }

    const user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        password: req.user.password,
        age: age,
        favoriteBeatle: favoriteBeatle,
        iceCream: iceCreamBool,
    };

    let beatles = [
        { name: "John" },
        { name: "Paul" },
        { name: "Ringo" },
        { name: "George" },
    ];

    if (errors.length > 0) {
        res.render("create-interesting", {
            beatles,
            user,
            errors,
            csrfToken: req.csrfToken(),
        });
        return;
    }

    idCount++;
    user.id = idCount;

    users.push(user);
    res.redirect("/");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
