import React, { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import "./MovieCarousel.css"
import { usePathname, useParams } from 'next/navigation'

// import MovieCard from './MovieCard';


import { MovieCardType } from '@/types/types';
import MovieCard from './MovieCard';

const MovieCarouselExceptCurrentFilm = () => {
    const { movieid } = useParams();

    const [user, setUser] = React.useState<any>(null)



    const getuser = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/getuser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then((res) => {
                return res.json();
            })
            .then((response) => {
                console.log(response)
                if (response.ok) {
                    setUser(response.data)
                }

            })
            .catch((error) => {
                console.log(error)
            })

    }


    const [movies, setMovies] = React.useState<MovieCardType[]>([])

    const getMovies = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok) {
                    console.log(data)
                    const otherMovies = data.data.filter((m: any) => m._id !== movieid);
                    setMovies(otherMovies);
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    React.useEffect(() => {
        getMovies()
        getuser()
    }, [])
    return (
        <div className='sliderout'>
            {
                movies &&
                <div className='moviecarou'>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={1}
                        pagination={{
                            clickable: true,
                        }}
                        breakpoints={{
                            '@0.00': {
                                slidesPerView: 1,
                                spaceBetween: 2,
                            },
                            '@0.75': {
                                slidesPerView: 2,
                                spaceBetween: 2,
                            },
                            '@1.00': {
                                slidesPerView: 3,
                                spaceBetween: 2,
                            },
                            '@1.50': {
                                slidesPerView: 6,
                                spaceBetween: 2,
                            },
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                    >
                        {
                            movies.map((Movie) => {
                                return (
                                    <SwiperSlide key={Movie._id}>
                                        <MovieCard
                                            Movie={Movie}
                                            user={user}
                                        />
                                    </SwiperSlide>
                                )
                            })
                        }
                    </Swiper>
                </div>
            }
        </div>
    )
}

export default MovieCarouselExceptCurrentFilm