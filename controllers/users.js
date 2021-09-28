const db = require("../models");
const Users = db.users;
const bcrypt = require("bcrypt");

const { registerValidation, loginValidation } = require("../models/validation");

// creation d'un utilisateur.
exports.create = async (req, res) => {
    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).send(error.message);
    }

    // checking if the user is already registered in the database
    const emailExist = await Users.findOne({ where: { email: req.body.email } });
    if (emailExist) return res.status(400).send("L'addresse email est déjà utilisée par un autre utilisateur.");

    // hash the password
    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Model
    const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashPassword,
    };

    // insertion en bdd
    Users.create(user)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur est survenue pendant la creation de l'utilisateur.",
            });
        });
};

exports.login = async (req, res, next) => {
    // //  Verification data
    // const { error } = loginValidation(req.body);
    // if (error) res.status(400).send(error.message);
    // //  check if emailExist

    // const user = await Users.findOne({ where: { email: req.body.email } });
    // //  Vague message so as not to indicate if it's the e-mail or the password which is incorrect

    // if (!user) res.status(400).send("Email ou mot de passe incorrect.");

    // const validPassword = await bcrypt.compare(req.body.password, user.password);
    // if (!validPassword) return res.status(400).send("Email ou mot de passe incorrect.");

    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
    })(req, res, next);
};
