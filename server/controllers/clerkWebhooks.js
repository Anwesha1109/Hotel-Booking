import user from "../models/User.js"
import {Webhook} from "svix";
import connectDB from "../config/db.js";

const  clerkWebhooks = async (req,res)=>{
    try{

         await connectDB(); 

        // create a svix instance with clerk webhook secret
        const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // Getting Headers
        const headers={
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"],
        }

        console.log("Webhook reached");

        //verifying Headers
        await whook.verify(JSON.stringify(req.body),headers)

        console.log("Verified ✅");



        //getting data from request body
        const {data,type}=req.body

        console.log("Event:", type);

       const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
         username: (data.first_name || "") + " " + (data.last_name || ""),
         image: data.image_url || "",
          recentSearhedCities: []
         };
        //switch cases for different Events
        switch (type) {
            case "user.created":{
                await user.create(userData)
                break;
            }
            case "user.updated":{
                await user.findByIdAndUpdate(data.id,userData);
                break;
            }
            case "user.deleted":{
                await user.findByIdAndDelete(data.id,userData);
                break;
            }
            
        
            default:
                break;
        }
        res.json({success:true, message:"Webhook Received"})

    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

export default clerkWebhooks;