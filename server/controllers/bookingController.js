import Booking from "../models/Bookings.js"
import Room from "../models/room.js";
import Hotel from "../models/Hotel.js";
import transpoter from "../config/nodemailer.js";


//Function to check availability of the room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });
        const isAvailable = bookings.length === 0;//if there is no booking then room is available 
        return isAvailable;
    } catch (error) {
        console.log(error.message);
    }
}
//API to check availability of room 
//POST /api/bookings/check-availability

export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.json({ success: true, isAvailable })

    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

// API to create a new booking
// //POST /api/bookings/book
export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate,guests } = req.body;
        const user = req.user._id;

        //Before booking check availability 
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });

        if (!isAvailable) {
            return res.json({ success: false, message: "Room is not available" })
        }
        //Get total price from room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        //calculate total price based on nights
        const checkIn = new Date(checkInDate) //convert dates into javascript dates
        const checkOut = new Date(checkOutDate)

        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice *= nights;
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:req.user.email,
            subject:'Hotel Booking Details',
            html:`
            <h2> Your Booking Details</h2>
            <p>Dear ${req.user.username},</p>
            <p>Thank you for your booking! Here are your details:</p>
            <ul>
                 <li> <strong>Booking ID:</strong>${booking._id}</li>
                 <li> <strong>Hotel Name:</strong>${booking.hotel.name}</li>
                 <li> <strong>Location:</strong>${roomData.hotel.address}</li>
                 <li> <strong>Date:</strong>${booking.checkInDate.toDateString()}</li>
                 <li> <strong>Booking Amount:</strong>${process.env.CURRENCY || '$'} ${booking.totalPrice}/night</li>
            </ul>
            <p> we look forward to welcoming you!</p>
            <p>If you need to make any changes,feel free to contact us</p>`
        }
        await transpoter.sendMail(mailOptions)
        res.json({ success: true, message: "Booking created  successfully" })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
};


//API to get all the bookings for a user
//GET /api/bookings/user

export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;

        const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 })
        res.json({ success: true, bookings })

    } catch (error) {
        res.json({ success: false, message: "Failed to fetch booking" })

    }
}
//API to get bookings for the owner
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.user._id });
        if (!hotel) {
            return res.json({ success: false, message: "No Hotel Found" })
        }
        const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 });
        //Total bookings
        const totalBookings = bookings.length;
        //Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)

        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } })
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" })

    }
}