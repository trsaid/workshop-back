const db = require("../models");
const { appValidation } = require("../models/validation");
var CryptoJS = require("crypto-js");

const Users = db.users;
const Passwords = db.passwords;


// creation d'un utilisateur.
exports.create = async (req, res) => {
    const { error } = appValidation(req.body);

    if (error) {
        return res.status(400).send(error.message);
    }
    const user = await Users.findOne({where: {id: req.user.id}});
    

    let ciphertext = CryptoJS.AES.encrypt(req.body.password, user.password).toString();

    // var bytes = CryptoJS.AES.decrypt("U2FsdGVkX18oYaUyRCxwN1k5z8EdzvmQebSTpYfbRQA=", "123");
    // var data = bytes.toString(CryptoJS.enc.Utf8);
    // console.log(data);

    //Model
    const app_data = {
        libelle: req.body.libelle,
        expirationDelay: req.body.expirationDelay,
        password: ciphertext,
        userId: user.id
    };

    // insertion en bdd
    Passwords.create(app_data)
        .then(data => {
            res.status(201).send({success: true, message: "L'application a été ajoutée au coffre fort."});
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Une erreur est survenue pendant la creation de l'application",
            });
        });
};

exports.show = async (req, res) => {

}

exports.findByUser = (req, res) => {
    Passwords.findAll({ where: { userId: req.user.id } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Impossible de recuperer le coffre fort.",
            });
        });
};
