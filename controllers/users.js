const db = require("../models");
const Users = db.users;
const bcrypt = require("bcrypt");

const { registerValidation, loginValidation } = require("../models/validation");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");

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
    //  Verification data
    const { error } = loginValidation(req.body);
    if (error) res.status(400).send(error.message);
    //  check if emailExist

    const user = await Users.findOne({ where: { email: req.body.email } });
    //  Vague message so as not to indicate if it's the e-mail or the password which is incorrect

    if (!user) res.status(400).send("Email ou mot de passe incorrect.");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Email ou mot de passe incorrect.");

    //  Create and assign a token
    const token = jwt.sign({ id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email }, process.env.TOKEN_SECRET);
    res.cookie("auth-token", token, {
        secure: false,
        httpOnly: true,
        expires: dayjs().add(30, "days").toDate(),
    });
    return res.header("auth-token", token).send({ token: token }).status(200);
};

exports.updatePassword = async (req, res) => {
    const id = req.params.id;

    const user = await Users.findOne({ where: { id: req.user.id } });

    let ciphertext = CryptoJS.AES.encrypt(req.body.password, user.password).toString();

    Passwords.update(
        { password: ciphertext },
        {
            where: { id: id },
        }
    )
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: `Le mot de passe ${id} a été mis à jour`,
                });
            } else {
                res.status(400).send({
                    message: `Erreur dans la mise à jour du mot de passe ${id}`,
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Impossible de mettre à jour le mot de passe ${id}`,
            });
        });
};
//Vérifie si un utilisateur est connecté
exports.check = async (req, res) => {
    let token = req.cookies["auth-token"];

    if (!token) {
        res.status(403).send({
            message: `Token manquant.`,
        });
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET); // verifie le token avec notre signature

        res.status(200).send({ user: verified });
    } catch (err) {
        res.status(400).send("Invalid token");
    }
};
