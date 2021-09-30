var express = require("express");
var router = express.Router();
const passwords = require("../controllers/passwords");
const { isAuth, tokenCheck } = require("../models/verifytoken");

//Add new app
router.post("/new", isAuth, passwords.create);
router.put("/update/:id", isAuth, passwords.update);
router.delete("/delete/:id", isAuth, passwords.delete);

router.get("/list", isAuth, passwords.findByUser);


module.exports = router;
