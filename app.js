var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mysql = require("mysql");
require("dotenv").config();

/* Routes dependencies */
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var passwordsRouter = require("./routes/passwords");

// Sets up the Express App
// =============================================================
var app = express();
/* Passport & session dependencies */
const session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
const passport = require("passport");
require("./config/passport")(passport);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var connection = mysql.createConnection({
    host: process.env.SESSIONSDB_HOST,
    port: process.env.SESSIONSDB_PORT,
    user: process.env.SESSIONSDB_USER,
    password: process.env.SESSIONSDB_PASS,
    database: process.env.SESSIONSDB_DB,
});

var sessionStore = new MySQLStore(
    {
        checkExpirationInterval: parseInt(process.env.SESSIONSDB_CHECK_EXP_INTERVAL, 10),
        expiration: parseInt(process.env.SESSIONSDB_EXPIRATION, 10),
    },
    connection
);

//express session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
        store: sessionStore,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* Routes */
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/passwords", passwordsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
