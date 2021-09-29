var express = require("express");
var router = express.Router();
const passwords = require("../controllers/passwords");
const { isAuth } = require("../models/verifytoken");

//Add new app
router.post("/new", isAuth, passwords.create);

router.get("/list", isAuth, passwords.findByUser);


module.exports = router;
