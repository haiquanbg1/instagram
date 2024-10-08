require("dotenv").config();

module.exports = {
  development: {
    username: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
    host: process.env.db_host,
    port: process.env.db_port,
    dialect: "mysql",
    seederStorage: "json",
    migrationStorage: "json",
    migrationStoragePath: "sequelizeMigrate.json",
    seederStoragePath: "sequelizeSeed.json",
  },
  test: {
    username: "root",
    password: null,
    database: "database_development",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: null,
    database: "database_development",
    host: "127.0.0.1",
    dialect: "mysql"
  }
}
