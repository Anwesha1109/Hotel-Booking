import React from 'react'

import HotelCard from './HotelCard'
import Title from './Title'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useEffect } from 'react'
import { useState } from 'react'

const RecommendedHotel = () =>{
    const {rooms,searchedCities}=useAppContext();
    const [recommended,setRecommended]=useState([]);

    const filterHotels=()=>{
        const filteredHotels=rooms.slice().filter(room =>searchedCities.includes(room.hotel.city));
        setRecommended(filteredHotels);
    }
    useEffect(()=>{
        if(!rooms||!searchedCities|| searchedCities.length===0){
            setRecommended([]);
            return;
        }
        filterHotels()
    },[rooms,searchedCities])

    
    return recommended.length > 0 && (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20 '>
            <Title title='Recommended Hotels' subTitle='Discover our handpicked selection of exceptional properties around the world,offering unparalleled luxury and unforgettable experiences'/>
            <div className='flex flex-wrap items-center justify-center gap-6 mt-20 '>
                {recommended.slice(0,4).map((room,index)=>(
                    // room is the variable here roomsDummyData is an array of object  and room is a variable which represents each object
                    <HotelCard key={room._id} room={room} index={index}/>

                ))}
            </div>
            

        </div>
    )
}
export default RecommendedHotel