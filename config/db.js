const { Sequelize } = require('sequelize')


const dbConfig ={
    username : process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    db:process.env.DB_NAME
}
async function createDB(mysql,dbConfig){
    const connect = await mysql.createConnection({
        host:"localhost",
        user:dbConfig.username,
        password:dbConfig.password
    })
    connect.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.db};`)
}
const sequelize = new Sequelize(
    dbConfig.db,
    dbConfig.username,
    dbConfig.password,
    {
        host:'localhost',
        dialect:'mysql'
    }
)

// const sequelize_sqlite = new Sequelize ({
//     dialect: 'sqlite',
//     host: './sessions.sqlite'
//   })

module.exports = {
    sequelize,
    createDB
}
