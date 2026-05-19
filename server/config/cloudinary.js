import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Verify what's actually being used
  const config = cloudinary.config();
  console.log("Cloudinary config in use:", {
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret ? "✅ loaded" : "❌ MISSING",
  });
};

export default connectCloudinary;