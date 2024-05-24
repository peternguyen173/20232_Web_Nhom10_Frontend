"use client"
import React from 'react';
import './BookingDataPage.css';
import Link from 'next/link';

const ProfilePage = () => {
    const [bookings, setBookings] = React.useState<any>(null);
    const [user, setUser] = React.useState<any>(null);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const pageSize = 6; // Số lượng vé mỗi trang

    const getBookings = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getuserbookings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (data.ok) {
                setBookings(data.data);
            } else {
                console.log(data.error); // Xử lý lỗi nếu có
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const getUserData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/getuser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (data.ok) {
                setUser(data.data);
            } else {
                console.log(data.error); // Xử lý lỗi nếu có
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    React.useEffect(() => {
        getBookings();
        getUserData();
    }, []);

    const calculateTotalSpending = () => {
        if (bookings) {
            const totalSpending = bookings.reduce((accumulator: any, currentBooking: any) => {
                return accumulator + (currentBooking.totalPrice ? currentBooking.totalPrice : 0);
            }, 0);
            return totalSpending;
        }
        return 0;
    };

    const totalPages = Math.ceil((bookings?.length || 0) / pageSize);

    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    };

    const visibleBookings = bookings?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className='profile'>
            <h1 className='head'>Lịch sử đặt vé</h1>
            <div className='user'>
                <div className='details'>
                    <div className='detail'>
                        <h3>Name</h3>
                        <p>{user?.name}</p>
                    </div>
                    <div className='detail'>
                        <h3>Số điện thoại</h3>
                        <p>{user?.phonenumber}</p>
                    </div>
                    <div className='detail'>
                        <h3>Email</h3>
                        <p>{user?.email}</p>
                    </div>
                </div>
            </div>
            <h2 className='s'> Tổng chi tiêu:  {calculateTotalSpending()} đ</h2>
            <div className='bookings'>
                <h2>Vé đã đặt</h2>
                <div className='details'>
                    {visibleBookings?.map((booking: any) => (
                        <div className='booking' key={booking && booking._id}>
                            <div className='detail'>
                                <h3>Phim</h3>
                                <p>{booking ? booking.moviename : 'No movie selected'}</p>
                            </div>
                            <div className='detail'>
                                <h3>Phòng chiếu</h3>
                                <p>{booking ? booking.screenname : 'No screen selected'}</p>
                            </div>
                            <div className='detail'>
                                <h3>Ghế</h3>
                                <p>
                                    {booking && booking.seats
                                        ? booking.seats.map((seat: any, index: any) => (
                                            <span key={index}>{seat.rowname}{seat.seat_id}{" "} </span>
                                        ))
                                        : 'No seats selected'}
                                </p>
                            </div>
                            <div className='detail'>
                                <h3>Tổng thanh toán</h3>
                                <p>{booking ? booking.totalPrice : 'N/A'} đ</p>
                            </div>
                            <div className='detail'>
                                <h3>Ngày chiếu</h3>
                                <p>{booking ? new Date(booking.showDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className='detail'>
                                <h3>Giờ chiếu</h3>
                                <p>{booking ? booking.showTime : 'N/A'}</p>
                            </div>
                            <div className='detail'>
                                <h3>Ngày đặt vé</h3>
                                <p>{booking ? new Date(booking.bookDate).toLocaleString() : 'N/A'}</p>
                            </div>
                            <div className='detail'>
                                <h3>Bỏng, nước</h3>
                                <p>{booking ? booking.cornquantity : 'N/A'} bỏng ngô - {booking ? booking.waterquantity : 'N/A'} nước</p>
                            </div>
                            <div className='detail'>
                                <h3>Mã hóa đơn</h3>
                                <p>{booking ? booking._id : 'N/A'}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='pagination'>
                    
                    <button onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1}>Trước </button>&nbsp;
                    <span>{currentPage} / {totalPages}</span>
                    &nbsp;
                    <button onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages}> Sau</button>
                </div>
            </div>
            <a href="/profile">
                <button className='btn1'><h2>Quay về trang thông tin cá nhân</h2></button>
            </a>
        </div>
    );
};

export default ProfilePage;
