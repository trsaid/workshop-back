module.exports = (sequelize, Sequelize) => {
    const Passwords = sequelize.define("passwords", {
        libelle: {
            type: Sequelize.STRING,
        },
        password: Sequelize.STRING,
        expirationDelay: Sequelize.INTEGER,
    });

    return Passwords;
};
