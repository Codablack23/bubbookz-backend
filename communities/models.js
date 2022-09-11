const {DataTypes,Model} = require("sequelize")
const {sequelize} = require("../config/db")

class Community extends Model{}
class CommunityMembers extends Model{}
class CommunityLikes extends Model{}

Community.init({
  id:{
    type:DataTypes.BIGINT,
    autoIncrement:true,
    primaryKey:true
  },
  community_id:{
    type:DataTypes.STRING,
    allowNull:false
  },
  title:{
    type:DataTypes.STRING,
    allowNull:false
  },
  about:{
    type:DataTypes.TEXT("long"),
    allowNull:false
  },
  banner_img:{
    type:DataTypes.STRING
  },
  createdBy:{
    type:DataTypes.STRING,
    allowNull:false 
  },
  status:{
    type:DataTypes.STRING,
    allowNull:false
  }
},{sequelize,tableName:"communities"})

CommunityMembers.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
      },
    member:{
        type:DataTypes.STRING,
        allowNull:false
    },
    community_id:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{sequelize,tableName:"community_members"})

CommunityLikes.init({
    id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
      },
    member:{
        type:DataTypes.STRING,
        allowNull:false
    },
    community_id:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{sequelize,tableName:"community_likes"})

module.exports = {
  Community,
  CommunityLikes,
  CommunityMembers
}