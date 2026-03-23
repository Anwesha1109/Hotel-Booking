import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing DB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;

    console.log("Database connected");
  } catch (error) {
    console.log("DB connection error:", error);
  }
};

export default connectDB;