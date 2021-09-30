var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mysql = require("mysql");
require("dotenv").config();
const cors = require("cors");

/* Routes dependencies */
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var passwordsRouter = require("./routes/passwords");

// Sets up the Express App
// =============================================================
var app = express();

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'], 
    allowedHeaders: ["Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id, auth-token"],
    exposedHeaders: ["x-access-token, x-refresh-token"],
    optionsSuccessStatus: 200,
}));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
