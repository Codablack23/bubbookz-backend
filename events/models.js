const {Model,DataTypes} = require("sequelize")
const {sequelize} = require("../config/db")

class Events extends Model{}
class EventSubscribers extends Model{}

Events.init({
   id:{
    type:DataTypes.BIGINT,
    autoIncrement:true,
    primaryKey:true,
   },
   no_of_reg:{
    type:DataTypes.STRING,
    defaultValue:0
   },
   event_id:{
    type:DataTypes.STRING,
    allowNull:false
   },
   name:{
    type:DataTypes.TEXT("medium"),
    allowNull:false
   },
   contact_number:{
    type:DataTypes.BIGINT,
    allowNull:false
   },
   location:{
    type:DataTypes.STRING,
    allowNull:false
   },
   registration_link:{
    type:DataTypes.STRING,
    allowNull:false
   },
   location_link:{
    type:DataTypes.STRING,
    allowNull:false
   },
   event_date:{
     type:DataTypes.DATE,
     allowNull:false,
   },
   event_time:{
    type:DataTypes.STRING,
    allowNull:false
   },
   description:{
    type:DataTypes.TEXT("long"),
    allowNull:false
   },
   img_link:{
    type:DataTypes.TEXT("long"),
    allowNull:false
   },
   hosts:{
    type:DataTypes.TEXT("long"),
    allowNull:false,
   },
   price:{
    type:DataTypes.BIGINT,
    allowNull:false
   }
},{sequelize,tableName:"events"})

EventSubscribers.init({
    id:{
        type:DataTypes.BIGINT,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone_no:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    event_id:{
        type:DataTypes.STRING,
        allowNull:false   
    },
    passcode:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{sequelize,tableName:"event_subscribers"})


module.exports = {
    Events,
    EventSubscribers,

}