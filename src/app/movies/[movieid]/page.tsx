'use client'
import React from 'react'
import { BsShare } from 'react-icons/bs'
import { BsFillStarFill } from 'react-icons/bs';
import './MoviePage.css'
import MovieCarousel from '@/components/MovieCarousel/MovieCarousel';


import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import CelebCard from '@/components/CelebCard/CelebCard';
import { usePathname, useParams } from 'next/navigation'
import Link from 'next/link';
import MovieCarouselExceptCurrentFilm from '@/components/MovieCarousel/MovieCarouselExceptCurrentFilm';


const MoviePage = () => {
    const pathname = usePathname()
    const { movieid } = useParams()
    console.log(movieid)
    const [movie, setMovie] = React.useState<any>(null)
    console.log(movieid)

    const getMovie = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies/${movieid}`, {
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
                    setMovie(data.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })




    }

    React.useEffect(() => {
        getMovie()
    }, [])
    const formattedDate = movie ?
        `${new Date(movie.releasedate).getDate()}/${new Date(movie.releasedate).getMonth() + 1}/${new Date(movie.releasedate).getFullYear()}`
        : '';


    return (
        <>
            {movie &&
                <div className='moviepage'>
                    <div className='c1' style={{
                        backgroundImage: `url(${movie.landscapeImgUrl})`
                    }}>
                        <div className='c11'>
                            <div className='left'>
                                <div className='movie_poster'
                                    style={{
                                        backgroundImage: `url(${movie.portraitImgUrl})`
                                    }}
                                >
                                </div>
                                <div className='movie_details'>
                                    <p className='title'>
                                        {movie.title}
                                    </p>

                                    <span className='releasedate'>
                                        Đạo diễn:  {movie.director}
                                    </span>
                                    <p className='duration_type_releasedat'>
                                        <span className='duration'>
                                            Thời lượng: {movie.duration} phút
                                        </span>
                                    </p>
                                    <span className='type'>
                                        Thể loại: {movie.genre.join(', ')}
                                    </span>
                                    <span className='releasedate'>
                                        Khởi chiếu:  {formattedDate}
                                    </span>
                                    <span className='releasedate'>
                                        Rated:  {movie.rated}
                                    </span>
                                    <Link
                                        href={`${pathname}/buytickets`}
                                        className='linkstylenone'
                                    >
                                        <button className='bookbtn'>Đặt vé</button>
                                    </Link>

                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='c2'>
                        <h1>Thông tin về phim</h1>
                        <p>{movie.description}</p>
                        <div></div>
                        <h1>Có thể bạn cũng thích</h1>
                    </div>
                    <div className='g'><MovieCarouselExceptCurrentFilm /></div>


                </div>
            }
        </>
    )
}

export default MoviePage