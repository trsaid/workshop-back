const jwt = require("jsonwebtoken");

module.exports.isAuth = (req, res, next) => {
    const token = req.headers["auth-token"]; // get the token by attribute defined in
    if (!token) return res.status(401).send("Access Denied");

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET); // verifie le token avec notre signature
        
        req.user = verified; // assign data to verified (_id)
        next(); // call the next middlewares
    } catch (err) {
        res.status(400).send("Invalid token");
    }
};

//Vérifie si le token appartient bien à l'utilisateur
module.exports.tokenCheck = (req, res) => {
    var tokenId = req.user.id;

    if (req.params.userId != tokenId) {
        return res.status(403).send({
            message: "Accès refusé.",
        });
    }
};

module.exports.tokenDecrypt = (req, res) => {
    const token = req.params.token;
    if (!token) return res.status(401).send("No token");

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET); // verifie le token avec notre signature
        res.status(200).send(verified); // assign data to verified (_id)
    } catch (err) {
        res.status(400).send("Invalid token");
    }
};
