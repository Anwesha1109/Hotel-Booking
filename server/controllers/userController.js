// GET /api/user/
import User from "../models/User.js";

export const getUserData= async (req,res) =>{
    try{
        const role=req.user.role;
        const recentSearhedCities=req.user.recentSearhedCities;
        res.json({success:true,role,recentSearhedCities})

    } catch(error){
        res.json({success:false,message:error.message})

    }
}

//store user recent serched cities

export const storeRecentSearchedCities= async (req,res)=>{
    try{
        const{recentSearhedCity}=req.body
        const user=await req.user;

        if(user.recentSearhedCities.length<3){
            user.recentSearhedCities.push(recentSearhedCity)
        }else{
            user.recentSearhedCities.shift();//shift removes the first element
            user.recentSearhedCities.push(recentSearhedCity)
        }
        await user.save();
        res.json({success:true,message:"City Added"})
    }
    catch(error){
        res.json({success:false,message:error.message})

    }
}