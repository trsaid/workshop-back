require("dotenv").config();

module.exports = {
    HOST: process.env.SESSIONSDB_HOST,
    USER: process.env.SESSIONSDB_USER,
    PASSWORD: process.env.SESSIONSDB_PASS,
    DB: process.env.SESSIONSDB_DB,
    dialect: "mysql",
    port: process.env.SESSIONSDB_PORT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}