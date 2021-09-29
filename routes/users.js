var express = require("express");
var router = express.Router();
const users = require("../controllers/users");
const { isAuth } = require("../models/verifytoken");

router.post("/register", users.create);

router.post("/login", users.login);

router.get("/test", isAuth, (req, res, next) => {    
    res.status(200).send(req.user);
});

//logout
router.get("/logout", (req, res) => {});
module.exports = router;
