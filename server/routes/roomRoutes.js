import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { createRoom, getOwnerRooms, toggleRoomAvailability,getRooms } from '../controllers/roomController.js';
import {protect} from '../middleware/authMiddleware.js'

const roomRouter=express.Router();

roomRouter.post('/',protect,upload.array("images",4),createRoom)
roomRouter.get('/',getRooms)
roomRouter.get('/owner',protect,getOwnerRooms)
roomRouter.post('/toogle-availability',protect,toggleRoomAvailability)

export default roomRouter