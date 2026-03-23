//main file of backend
// cors-connect backend with frontend
// cloudinary-store image in cloud
// svix-make API calls http request
// "type":"module",-with the help of this we can use import statement in our backend project
//remembr to store nodemon server
import express from "express"
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB()

const app=express()
app.use(cors()) //enable cross origin resource sharing

//middleware
app.use(clerkMiddleware())
app.use(express.json)



// API TO LISTEN CLERK WEBHOOK
app.use("/api/clerk",clerkWebhooks)

app.get('/',(req,res)=>res.send("API is working"))

const PORT=process.env.PORT || 3000;//if that port is available on the environment rariable then we will use that otherwise we will use port no. 300
app.listen(PORT,()=> console.log(`server running on port ${PORT}`)) //app.listen start this backend server