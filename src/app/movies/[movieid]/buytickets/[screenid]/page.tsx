"use client"
import React, { useState, useEffect } from 'react'
import './SelectSeat.css'
import Link from 'next/link';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

const SelectSeatPage = () => {

    const pathname = usePathname()
    const params = useParams()


    const searchParams = useSearchParams()
    const date = searchParams.get('date');

    const showtime = searchParams.get('time')

    const { movieid, cityname, screenid } = params
    console.log(movieid, cityname, screenid, showtime)
    const [bookingConfirmed, setBookingConfirmed] = useState(false); // State để đánh dấu khi đặt vé thành công



    const [movieSchedulesforDate, setmovieSchedulesforDate] = React.useState<any>(null)
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [discount, setDiscount] = React.useState<number>(0);
    const [additionalPrice, setAdditionalPrice] = React.useState<number>(0);
    const [burnQuantity, setBurnQuantity] = useState(0);
    const [waterQuantity, setWaterQuantity] = useState(0);

    const [screen, setScreen] = React.useState<any>(null)
    const [selectedTime, setSelectedTime] = React.useState<any>(null)

    const getschedules = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/schedulebymovie/${screenid}/${date}/${showtime}/${movieid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(response => {
                if (response.ok) {
                    console.log(response.data)
                    setmovieSchedulesforDate(response.data.movieSchedulesforDate)
                    setScreen(response.data.screen)
                    setSelectedTime(response.data.movieSchedulesforDate[0])
                }

                else {
                    console.log(response)
                }
            })
            .catch(err => console.log(err))
        console.log("A2a")
        console.log(movieSchedulesforDate)
    }

    const [movie, setMovie] = React.useState<any>(null)


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
                    console.log('movie', data.data)
                    setMovie(data.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    React.useEffect(() => {
        getschedules()
        getMovie()
    }, [])


    const [selectedSeats, setSelectedSeats] = React.useState<any[]>([])




    const selectdeselectseat = (seat: any) => {
        console.log(seat)
        console.log("seat")

        console.log(selectedSeats)

        // {
        //     "row": "F",
        //     "col": 1,
        //     "seat_id": "6",
        //     "price": 500
        // }
        const isselected = selectedSeats.find((s: any) => (
            s.rowname === seat.rowname &&
            s.seat_id === seat.seat_id
        ))

        if (isselected) {
            setSelectedSeats(selectedSeats.filter((s: any) => (
                s.rowname !== seat.rowname ||
                s.seat_id !== seat.seat_id
            )))
            calculateTotalPrice();
        }

        else {
            setSelectedSeats([...selectedSeats, seat])
            
        }
        console.log(selectedSeats)
    }

    const generateSeatLayout = () => {

        console.log(selectedTime)

        if (screen && selectedTime) {
            const currentSchedule = movieSchedulesforDate.find(
                (schedule: any) => schedule.showTime === selectedTime.showTime
            );

            if (currentSchedule) {

                const notAvailableSeats = currentSchedule.notAvailableSeats;

                return (

                    <div>
                        {screen.rows.map((row: any, rowIndex: any) => (
                            <div className="seat-row" key={rowIndex}>
                                <p className="rowname">{row.rowname}</p>
                                <div className="seat-cols">
                                    {row.cols[0].seats.map((seat: any, seatIndex: any) => {
                                        seat.seatId = `${row.rowname}${seatIndex + 1}`;
                                        seat.price = row.price;
                                        seat.rowname = row.rowname;
                                        let isNotAvailable = notAvailableSeats.some(
                                            (notAvailableSeat: any) => (
                                                notAvailableSeat.rowname === seat.rowname &&
                                                notAvailableSeat.seat_id === seat.seat_id
                                            )
                                        );
                                        return (
                                            <div key={seatIndex}>
                                                {seat.isWalkway ?
                                                    <span className='seat-iswalkway'>
                                                        <div className='f'>{row.rowname}{seatIndex + 1}</div>
                                                    </span> :
                                                    notAvailableSeats.find((s: any) => (
                                                        s.rowname === seat.rowname &&
                                                        s.seat_id === seat.seat_id
                                                    )) ?
                                                        <span className='seat-unavailable'>
                                                            <div className='f'>{row.rowname}{seatIndex + 1}</div>
                                                        </span>
                                                        :
                                                        <span className={
                                                            selectedSeats.find((s: any) => (
                                                                s.rowname === seat.rowname &&
                                                                s.seat_id === seat.seat_id
                                                            )) ? 'seat-selected' : 'seat-available'
                                                        }
                                                            onClick={() => selectdeselectseat(
                                                                seat
                                                            )}
                                                        >
                                                            <div className='f'>{row.rowname}{seatIndex + 1}</div>
                                                        </span>

                                                }
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                        }
                    </div >
                );
            }
        }
    };

    // Xử lý sự kiện khi giá trị số lượng bỏng thay đổi
    const handleBurnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = parseInt(e.target.value);
        setBurnQuantity(quantity);
        updatePrice(quantity, waterQuantity);
    };

    // Xử lý sự kiện khi giá trị số lượng nước thay đổi
    const handleWaterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = parseInt(e.target.value);
        setWaterQuantity(quantity);
        updatePrice(burnQuantity, quantity);
    };

    // Cập nhật giá tiền dựa trên số lượng bỏng và nước
    const updatePrice = (burnQty: number, waterQty: number) => {
        const burnPrice = 40000 * burnQty;
        const waterPrice = 20000 * waterQty;
        const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0) + burnPrice + waterPrice;

        setAdditionalPrice(burnPrice + waterPrice);
        setFinalPrice(totalPrice);
    };

    // hàm tính tổng tiền
    const calculateTotalPrice = async () => {
        try {
            const basePrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);

            const promotionsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getpromotions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const promotionsData = await promotionsResponse.json();
            console.log("sdsds")
            console.log(date)
            if (promotionsData.ok) {
                if (date) {
                    console.log("sdsds")
                    console.log(date)
                    const formattedDateString = date.split(' (')[0]; // Loại bỏ phần không cần thiết sau giờ
                    const currentDate = new Date(formattedDateString);

                    const validPromotion = promotionsData.data.find((promotion: any) => {
                        const startDate = new Date(promotion.startDate);
                        const expiryDate = new Date(promotion.expiryDate);
                        return startDate < currentDate && currentDate < expiryDate;
                    });
                    console.log(validPromotion)
                    console.log("jkhoi")

                    let totalPrice = basePrice;
                    let discountAmount = 0;
                    console.log(validPromotion)
                    console.log(currentDate)
                    console.log("a")
                    console.log(selectedTime)

                    if (validPromotion) {
                        if (validPromotion.type === 'percentage') {
                            discountAmount = (validPromotion.discount / 100) * basePrice;
                            totalPrice -= discountAmount;
                            setDiscount(discountAmount);
                        } else if (validPromotion.type === 'fixed') {
                            totalPrice -= validPromotion.discount;
                            setDiscount(validPromotion.discount);
                        }
                        const burnPrice = 40000 * burnQuantity;
                        const waterPrice = 20000 * waterQuantity;
                        totalPrice = totalPrice + burnPrice + waterPrice;

                        setFinalPrice(totalPrice);

                        // Check if additional prices need to be added

                        setAdditionalPrice(additionalPrice);
                        setFinalPrice(totalPrice + additionalPrice);
                    } else {
                        // No valid promotion
                        setDiscount(0);
                        setAdditionalPrice(0);
                        setFinalPrice(totalPrice);
                    }
                } else {
                    console.log('Error fetching promotions.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    console.log(date)
    console.log("jkhoi")
    // Gọi hàm tính toán giá cuối cùng khi selectedSeats thay đổi hoặc component được render
    useEffect(() => {
        calculateTotalPrice();
    }, [selectedSeats]);


    const handleBooking = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/bookticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                showTime: selectedTime.showTime,
                showDate: date,
                movieId: movieid,
                screenId: screenid,
                seats: selectedSeats,
                totalPrice: finalPrice,
                paymentId: 'abcxyz',
                paymentType: 'online',
                cornquantity: burnQuantity, // Thông tin về bỏng nước
                waterquantity: waterQuantity // Thông tin về nước
            })
        })
        .then(res => res.json())
        .then(response => {
            if (response.ok) {
                createNotification('Your booking was successful!');
                toast.success('Booking Successful');
                console.log(response);
                        setBookingConfirmed(true);

                if (typeof window !== 'undefined') {
                    // window.location.href = "/bookingdata";
                }
            } else {
                console.log(response);
            }
        })
        .catch(err => console.log(err));
    };
    
    const createNotification = (message:any) => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/notifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error creating notification:', error));
    };
    
    const updateFinalPrice = () => {
        // Calculate base price of selected seats
        const basePrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
    
        // Calculate total price by adding base price and additional options (burn, water)
        let totalPrice = basePrice + additionalPrice;
    
        // Apply discount if available
        totalPrice -= discount;
    
        // Set final price
        setFinalPrice(totalPrice);
    };
    
    // Call the updateFinalPrice function whenever selectedSeats or additionalPrice changes
    useEffect(() => {
        updateFinalPrice();
    }, [selectedSeats, additionalPrice]);
    

   

    return (
        <div className='selectseatpage'>
            {
                movie && screen &&
                <div className='s1'>
                    <div className='head'>
                        <h1>{movie.title} - {screen.name}</h1>
                        <h3>{movie.genre.join(" / ")}</h3>
                    </div>
                </div>
            }

            {
                screen &&
                <div className="selectseat">
                    <div className='timecont'>
                        {
                            movieSchedulesforDate.map((time: any, index: number) => (
                                <h3 className={selectedTime?._id === time._id ? 'time selected' : 'time'}
                                    onClick={() => {
                                        setSelectedTime(time)
                                        setSelectedSeats([])
                                    }} key={index}>
                                    Giờ chiếu: {time.showTime}
                                </h3>
                            ))
                        }
                    </div>
                    <div className='indicators'>
                        <div>
                            <span className='seat-unavailable'></span>
                            <p>Đã có người đặt</p>
                        </div>
                        <div>
                            <span className='seat-available'></span>
                            <p>Chưa có người đặt</p>
                        </div>
                        <div>
                            <span className='seat-selected'></span>
                            <p>Checked</p>
                        </div>
                    </div>
                    <p className="screen-text">Màn hình</p>
                    <br></br>

                    <div className="curve-line"></div>
                    <br></br>

                    {generateSeatLayout()}



                    <div className='totalcont'>
                        <div className='totalcont1'>
                            <div className='column1'>
                                <h2>Vé</h2>
                                <h2>Discount</h2>
                                <br></br>
                                <h2>Bỏng</h2>
                                <h2>Nước</h2>
                                <br></br>

                                <h2>Tổng thanh toán</h2>

                                <br></br>                                <br></br>

                            </div>
                            <div className='column2'>
                                <h3>{selectedSeats.reduce((acc, seat) => acc + seat.price, 0)} đ</h3>
                                <div className='ra'>-{discount} đ</div>

                                <br></br>
                                <div className='additional-options'>
                                    <label>
                                        <h3 className='i'><input type="number" value={burnQuantity} onChange={handleBurnChange} />

                                            *40.000 đ</h3>
                                    </label>
                                    <label>
                                        <h3 className='i'><input type="number" value={waterQuantity} onChange={handleWaterChange} />
                                            *20.000 đ</h3>
                                    </label>
                                </div><br></br>

                                <h3>{finalPrice !== null ? Math.max(0, finalPrice) : 0} đ</h3>
                                <br></br>
                                <button
                                    className='theme_btn1 linkstylenone'
                                    onClick={handleBooking}
                                >Đặt vé</button>
                            </div>
                        </div>



                    </div>
                </div>
            }
            {/* 

            <div className="selectseat">
            
               
                
              
            </div> */}
        </div>
    )
}

export default SelectSeatPage 