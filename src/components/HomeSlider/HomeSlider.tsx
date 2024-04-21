import React, { useRef, useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HomeSlider.css'

import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import Image from 'next/image';
interface Banner {
    imageUrl: string,
}

const HomeSlider = () => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    useEffect(() => {
        getBanners(); // Gọi hàm getBanners khi component được render
    }, []);
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        // Kiểm tra nếu window tồn tại trước khi thêm event listener
        if (typeof window !== 'undefined') {
            // Set giá trị ban đầu
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);

            // Thêm event listener để xử lý việc resize
            window.addEventListener('resize', handleResize);

            // Xóa event listener khi component unmount
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []); // Chạy effect này chỉ một lần sau khi render ban đầu

    // Rest của component code dùng width và height
    const [banners, setBanners] = useState<Banner[]>([]);

    const getBanners = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/banner/getbanners`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Banners fetched successfully:", data);
                setBanners(data.banners); // Cập nhật danh sách banners từ server
            } else {
                console.error("Failed to fetch banners.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };






    return (
        <div className='s'>
            <Swiper
                cssMode={true}
                navigation={true}
                pagination={true}
                mousewheel={true}
                keyboard={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                className="mySwiper"
            >
                {
                    banners.map((banner, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <Image src={banner.imageUrl} alt="" width={width} height={height / 2}
                                    style={{
                                        objectFit: "cover"
                                    }} />
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    )
}

export default HomeSlider