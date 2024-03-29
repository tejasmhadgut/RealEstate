import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import 'swiper/css/navigation';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listings/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listings/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listings/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div style={{ backgroundColor: '#F7F7F7', color: '#333' }}>
      {/* top */}
      <div className='flex flex-col gap-6 p-8 px-3 max-w-6xl mx-auto'>
        <h1 className='text-teal-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-indigo-600'>perfect</span>
          <br />
          place with ease
        </h1>
        <p className='text-gray-600 text-sm'>
          Sahand Estate is the best place to find your next perfect place to
          live. We have a wide range of properties for you to choose from.
        </p>
        <Link
          to={'/search'}
          className='text-sm text-white bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700'
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                  height: '500px',
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale, and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {renderListings('Recent offers', offerListings, '/search?offer=true')}
        {renderListings('Recent places for rent', rentListings, '/search?type=rent')}
        {renderListings('Recent places for sale', saleListings, '/search?type=sale')}
      </div>
    </div>
  );

  function renderListings(title, listings, link) {
    return (
      <div>
        {listings && listings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-indigo-600'>{title}</h2>
              <Link className='text-sm text-indigo-600 hover:underline' to={link}>
                Show more {title.toLowerCase()}
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {listings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
