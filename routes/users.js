var express = require("express");
var router = express.Router();
const users = require("../controllers/users");
const passport = require("passport");

router.post("/register", users.create);

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        res.status(err ? 500 : 200).send(err ? err : user);
    })(req, res, next);
});

router.get("/test", (req, res) => {
    res.status(200).send(res.user);
});

//logout
router.get("/logout", (req, res) => {});
module.exports = router;
