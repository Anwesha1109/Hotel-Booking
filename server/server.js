import "dotenv/config";
import express from "express"
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import userRouter from "./routes/userRoutes.js"
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";


await connectDB();
await connectCloudinary();
console.log("Cloudinary connected")

const app=express()
app.use(cors()) //enable cross origin resource sharing

//api to listen to stripe webhooks
app.post("/api/stripe",express.raw({type:"application/json"}),stripeWebhooks)
app.use(clerkMiddleware())
app.use(express.json())




app.get('/',(req,res)=>res.send("API is working"))
app.use('/api/user',userRouter)
app.use('/api/hotel',hotelRouter)
app.use('/api/rooms',roomRouter)
app.use('/api/bookings',bookingRouter)


// API TO LISTEN CLERK WEBHOOK
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);



 const PORT=process.env.PORT || 3000;//if that port is available on the environment rariable then we will use that otherwise we will use port no. 300
 app.listen(PORT,()=> console.log(`server running on port ${PORT}`)) //app.listen start this backend server
export default app