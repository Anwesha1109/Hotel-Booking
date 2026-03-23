import mongoose from "mongoose";

const UserSchema=mongoose.Schema({
    _id:{type:String,required:true},
    username:{type:String,required:true},
    email:{type:String,required:true},
    image:{type:String,required:true},
    role:{type:String,enum:["user","hotelOwner"],default:"user"},//role of the person using the  website
    recentSearhedCities:{type:String,required:true},
    


},{timestamps:true})//automatically time stamp is added when the user is created

const user=mongoose.model("User",UserSchema)

export default user;