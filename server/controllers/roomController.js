//API to create a new room for a hotel
import fs from "fs";
import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/room.js";

export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({ owner: req.user._id })

        if (!hotel) return res.json({ success: false, message: "No hotel found" });

        const config = cloudinary.config();
        console.log("At upload time - cloud_name:", config.cloud_name);
        console.log("At upload time - api_key:", config.api_key);
        console.log("At upload time - api_secret:", config.api_secret ? "present" : "MISSING");

        console.log("FILES:", req.files)
        //upload image to cloudninary
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path, {
                resource_type: "image",
            });

            // Delete local file after upload
            fs.unlinkSync(file.path);
            return response.secure_url;

        })
        //wait for all uploads to complete
        const images = await Promise.all(uploadImages)

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,//+ because peicePerNight is in string format which comes from frontend and we want it in number
            amenities: JSON.parse(amenities),//coverts string to array
            images,
        })

        res.json({ success: true, message: "Room Created Successfully" })

    } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("ERROR MESSAGE:", error.message);
        console.log("ERROR HTTP CODE:", error.http_code);
        res.json({ success: false, message: error.message })
    }


}



//API to get all rooms

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 })//sort by latest room first
        res.json({ success: true, rooms })

    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

//API to get all rooms for a specific hotel

export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.user._id })
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate("hotel");
        res.json({ success: true, rooms })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//API to toggle availability of the room

export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({ success: true, message: "Rooms availability Updated" });

    } catch (error) {
        res.json({ success: false, message: error.message });

    }
}