const {Model,DataTypes} = require("sequelize")
const {sequelize} = require("../config/db")

class Admin extends Model{}
class AdminAlert extends Model{}
class School extends Model{}
class Faculty extends Model{}

School.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true,
    },
    schoolname:{
      type:DataTypes.STRING,
      allowNull:false
    },
    school_id:{
      type:DataTypes.STRING,
      allowNull:false
    },
    admin:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{sequelize,tableName:"schools"})
Faculty.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false
    },
    departments:{
      type:DataTypes.STRING,
    },
    faculty_id:{
        type:DataTypes.STRING,
        allowNull:false
      },
    admin:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{sequelize,tableName:"faculties"})
Admin.init({
  id:{
    type:DataTypes.BIGINT,
    autoIncrement:true,
    primaryKey:true,
   },
   last_name:{
    type:DataTypes.STRING,
   },
   first_name:{
       type:DataTypes.STRING,
   },
   email:{
       type:DataTypes.STRING,
   },
   location:{
    type:DataTypes.STRING,
   },
   address:{
    type:DataTypes.STRING,
   },
   profile_picture:{
    type:DataTypes.STRING,
   },
   password:{
       type:DataTypes.STRING,
   },
   phone_no:{
       type:DataTypes.BIGINT,
   }
},{sequelize,tableName:'admin'})
AdminAlert.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    pending_orders:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    messages:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    email_alerts:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    events:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    admin:{
        type:DataTypes.STRING,
        allowNull:false,
    },
},{sequelize,tableName:'admin_alert_settings'})

class Uploads extends Model{}

Uploads.init({
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true
    },
    upload_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    url:{
        type:DataTypes.STRING,
        allowNull:false        
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    location:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{sequelize,tableName:'uploads'})

module.exports = {
    Admin,
    AdminAlert,
    Uploads,
    School,
    Faculty
}