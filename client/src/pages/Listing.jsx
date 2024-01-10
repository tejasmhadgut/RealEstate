import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules'
import SwiperCore from 'swiper'
import 'swiper/css/bundle';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing,setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)

    const params = useParams();

    useEffect(()=>{
        const fetchListing = async () => {
            try {
                console.log('are you there')
            setLoading(true);
            const res = await fetch(`/api/listings/get/${params.listingId}`);
            const data = await res.json();
            
            if(data.success === false){
                setError(true)
                setLoading(false) 
                return;
            }
                setListing(data);
                setLoading(false);
                setError(false)
            } catch (error) {
                console.log('no im here')
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();
    },[params.listingId]);
  return <main>
  {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
  {error && <p className='text-center text-red-700 my-7 text-2xl'>Something Went Wrong...</p>}
  {listing && !loading && !error && (
    (
        <div>
            <Swiper navigation>
                {listing.imageUrls.map((url)=>(
                    <SwiperSlide key={url}>
                        <div
                        className='h-[550px]'
                        style={{
                            background: `url(${url}) center no-repeat`,
                            backgroundSize: 'cover',
                        }}
                        ></div>
                    </SwiperSlide>
    ))}
            </Swiper>
        </div>
    )
  )}
    </main>;
  
}
