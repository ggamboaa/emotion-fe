module.exports = {
  development: {
    dialect: "mysql",
    //storage: "./db.development.sqlite"
  },
  test: {
    dialect: "mysql",
    //storage: ":memory:"
  },
  production: {
    username: 'bacd2602f8524e',
    password: '4376ff1b',
    database: 'heroku_5a536846eec525b',
    host: 'us-cdbr-iron-east-01.cleardb.net',
    dialect: 'mysql',
    use_env_variable: false
  }

};