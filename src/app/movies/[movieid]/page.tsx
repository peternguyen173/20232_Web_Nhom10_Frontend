'use client'
import React, { useState, useEffect } from 'react';
import { BsShare, BsFillStarFill } from 'react-icons/bs';
import './MoviePage.css';
import MovieCarousel from '@/components/MovieCarousel/MovieCarousel';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import CelebCard from '@/components/CelebCard/CelebCard';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import MovieCarouselExceptCurrentFilm from '@/components/MovieCarousel/MovieCarouselExceptCurrentFilm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MoviePage = () => {
    const pathname = usePathname();
    const { movieid } = useParams();
    const [movie, setMovie] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');
    const [avgRating, setAvgRating] = useState(0); 
    const [numberOfRatings, setNumberOfRatings] = useState(0);

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
                setMovie(data.data);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const getAvgRating = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/avgRating/${movieid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (data.avgRating) {
                setAvgRating(data.avgRating);
                setNumberOfRatings(data.numberOfRatings);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const checkLoginStatus = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/checklogin`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (data.ok) {
                setUserId(data.userId);
                setIsLoggedIn(true);
                getUserRating(data.userId);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
        }
    };

    const getUserRating = async (userId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/checkUserRating/${movieid}/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (data.hasRated) {
                setRating(data.rating);
            }
        } catch (error) {
            console.error('Error fetching user rating:', error);
        }
    };

    const handleRating = () => {
        if (!isLoggedIn) {
            window.location.href = '/login';
            return;
        }
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/rating`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ movieId: movieid, userId: userId, rating: rating })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                toast.success('Đánh giá của bạn đã được ghi nhận.');
                getMovie();
                getAvgRating();
            } else {
                toast.error('Đánh giá không thành công, vui lòng thử lại.');
            }
        })
        .catch((err) => {
            console.log(err);
            toast.error('Có lỗi xảy ra, vui lòng thử lại.');
        });
    };

    useEffect(() => {
        getMovie();
        checkLoginStatus();
    }, []);

    useEffect(() => {
        getAvgRating();
    }, [movieid]);

    const formattedDate = movie ? `${new Date(movie.releasedate).getDate()}/${new Date(movie.releasedate).getMonth() + 1}/${new Date(movie.releasedate).getFullYear()}` : '';

    return (
        <>
            {movie && (
                <div className='moviepage'>
                    <div className='c1' style={{ backgroundImage: `url(${movie.landscapeImgUrl})` }}>
                        <div className='c11'>
                            <div className='left'>
                                <div className='movie_poster' style={{ backgroundImage: `url(${movie.portraitImgUrl})` }}></div>
                                <div className='movie_details'>
                                    <div className='rating-section'>
                                        <p className='rating'>
                                            <BsFillStarFill className='star' />&nbsp;&nbsp;{avgRating.toFixed(1)}/10 &nbsp;({numberOfRatings} đánh giá)
                                        </p>
                                        <div className="rating-input">
                                            <label htmlFor='rating'>Đánh giá của bạn:</label>
                                            <select
                                                id='rating'
                                                value={rating}
                                                onChange={(e) => setRating(parseInt(e.target.value))}
                                            >
                                                {Array.from(Array(11).keys()).map(num => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                            <button onClick={handleRating}>Đánh giá</button>
                                        </div>
                                    </div>
                                    <span className='releasedate'>Đạo diễn: {movie.director}</span>
                                    <p className='duration_type_releasedat'>
                                        <span className='duration'>Thời lượng: {movie.duration} phút</span>
                                    </p>
                                    <span className='type'>Thể loại: {movie.genre.join(', ')}</span>
                                    <span className='releasedate'>Khởi chiếu: {formattedDate}</span>
                                    <span className='releasedate'>Rated: {movie.rated}</span>
                                    <Link href={`${pathname}/buytickets`} className='linkstylenone'>
                                        <button className='bookbtn'>Đặt vé</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='c2'>
                        <h1>Thông tin về phim</h1>
                        <p>{movie.description}</p>
                        <div className='line'></div>
                        <h1>Có thể bạn cũng thích</h1>
                    </div>
                    <div className='g'><MovieCarouselExceptCurrentFilm /></div>
                    <ToastContainer />
                </div>
            )}
        </>
    );
};

export default MoviePage;