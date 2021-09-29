module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        firstname: {
            type: Sequelize.STRING,
        },
        lastname: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
    });

    return Users;
};
