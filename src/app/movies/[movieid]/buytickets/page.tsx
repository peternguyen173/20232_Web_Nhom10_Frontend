'use client'
import React from 'react'
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for styling
import './BuyTicketsPage.css'
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation'



const BuyTicketsPage = () => {
    const pathname = usePathname()
    const params = useParams()
    const [selectedDate, setSelectedDate] = React.useState<any>(new Date())
    const { cityname, movieid } = params
    const [movie, setMovie] = React.useState<any>(null)
    const [theatres, setTheatres] = React.useState<any>(null)
    // const [selectedDate, setSelectedDate] = React.useState<any>(null)
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




        // {
        //     "_id": "65101a2acc5b257e6f2816a5",
        //     "title": "Jawan",
        //     "description": "A high-octane action thriller that outlines the emotional journey of a man who is set to rectify the wrongs in society.",
        //     "portraitImgUrl": "http://res.cloudinary.com/dy4laycuf/image/upload/v1695554088/wbfwtq1nksdazxdrelxa.webp",
        //     "landscapeImgUrl": "http://res.cloudinary.com/dy4laycuf/image/upload/v1695554090/s3iwjeae4nev6ug3r0et.png",
        //     "rating": 8,
        //     "genre": [
        //         "Action",
        //         "Thriller"
        //     ],
        //     "duration": 130,
        //     "cast": [],
        //     "crew": [],
        //     "__v": 0
        // }
    }

    const getTheatres = async (date: string) => {
        let movieId = movieid
        let city = cityname

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/screensbymovieschedule/${city}/${date}/${movieId}`, {
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
                    setTheatres(data.data)
                }
                else {
                    console.log(data)
                }
            })
        //     .catch((err) => {
        //         console.log(err)
        //     })
    }

    React.useEffect(() => {
        getMovie()
    }, [])

    React.useEffect(() => {
        getTheatres(selectedDate)
    }, [selectedDate])


    // const movie = {
    //     moviename: 'Jawan',
    //     screen: '4Dx',
    //     date: new Date(),
    //     language: 'Hindi',
    //     type: 'Action/Thriller',
    //     screens: [
    //         {
    //             name: 'Screen 1',
    //             location: 'PVR Cinemas, Forum Mall, Koramangala'
    //         },
    //         {
    //             name: 'Screen 2',
    //             location: 'PVR Cinemas, Forum Mall, Koramangala'
    //         },
    //         {
    //             name: 'Screen 3',
    //             location: 'PVR Cinemas, Forum Mall, Koramangala'
    //         }
    //     ]
    // }



    return (
        <>
            {
                movie &&
                <div className='buytickets'>
                    <div className='s1'>
                        <div className='head'>
                            <h1>{movie.title} - {movie.language}</h1>
                            <h3>{movie.genre.join(",")}</h3>
                        </div>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="MMMM d, yyyy"
                        />
                    </div>

                    {theatres && theatres.length > 0 && (
                        <div className='screens'>
                            {Array.from(new Set(theatres.map((screen: any) => screen._id))).map((uniqueScreenId: any, index: any) => {
                                const uniqueScreen = theatres.find((screen: any) => screen._id === uniqueScreenId);
                                return (
                                    <div className='screen' key={index}>
                                        <div className='a'>
                                            <h2>{uniqueScreen.name}</h2>
                                            <h3>{uniqueScreen.screenType}</h3>
                                            <div className='showtimes'>
                                                {uniqueScreen.movieSchedules.map((schedule: any, scheduleIndex: any) => (
                                                    schedule.movieId === movieid && (
                                                        <div className='showtime' key={scheduleIndex}>
                                                            <p>Thời gian chiếu: {schedule.showTime}
                                                            </p>
                                                            {/* Kiểm tra nếu schedule.movieId trùng với movieId thì hiển thị Link */}
                                                            <Link href={`${pathname}/${uniqueScreen._id}?time=${schedule.showTime}&date=${selectedDate}`} className='theme_btn1 linkstylenone'>Đặt vé</Link>
                                                            {/* Thêm nút hoặc hành động để chọn giờ chiếu */}
                                                        </div>
                                                    )
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}


                </div>
            }
        </>
    )
}

export default BuyTicketsPage 