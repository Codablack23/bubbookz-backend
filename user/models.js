const {sequelize} = require('../config/db')
const {DataTypes,Model} = require('sequelize')


class User extends Model {}

User.init({
    ID:{
     type:DataTypes.INTEGER,
     autoIncrement:true,
     primaryKey:true,
     
    },
    // isAdmin:{
    //    type:DataTypes.BOOLEAN,
    //    defaultValue:false
    // },
    Last_Name:{
     type:DataTypes.STRING,
    },
    First_Name:{
        type:DataTypes.STRING,
    },
    Email:{
        type:DataTypes.STRING,
        unique:true
    },
    School:{
        type:DataTypes.STRING,
    },   
    Faculty:{
        type:DataTypes.STRING,
    }, 
    Department:{
        type:DataTypes.STRING,
    },
    Last_Name:{
        type:DataTypes.STRING,
    },
    User_ID:{
        type:DataTypes.UUIDV4,
    },
    Password:{
        type:DataTypes.STRING,
    }
},
{
 sequelize,
 tableName:'users'}
)

module.exports = {
    User
}