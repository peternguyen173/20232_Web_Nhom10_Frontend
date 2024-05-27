'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Navbar from '@/components/Navbar/Navbar';
import './auth.css';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import logo from '@/assets/logo.png';
import 'react-toastify/dist/ReactToastify.css';


interface FormData {
    name: string;
    phonenumber?: string; // Số điện thoại không bắt buộc, có thể là undefined
    email: string;
    password: string;
    confirmPassword: string;
    dob: Date;
    gender: string;
}

export default function Signup() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        phonenumber: '',
        confirmPassword: '',
        dob: new Date(2000, 0, 1),
        gender: ''
    });
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0'); // Cộng thêm 1 vì getMonth() trả về từ 0 - 11
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [errors, setErrors] = useState<Record<string, string>>({});


    const handleChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'dob') {
            const dateOfBirth = new Date(value); // Chuyển đổi chuỗi ngày tháng thành đối tượng Date
            setFormData({
                ...formData,
                dob: dateOfBirth,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        console.log(formData)
        setErrors({})

        const validationErrors: Record<string, string> = {};
        if (!formData.email) {
            validationErrors.email = 'Email is required';
        }
        if (!formData.password) {
            validationErrors.password = 'Password is required';
        }
        if (formData.password !== formData.confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match';
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                return res.json();

            })
            .then((response) => {

                if (response.ok) {
                    console.log(response);
                    toast(response.message, {
                        position: 'top-right',
                        type: 'success',
                        autoClose: 2000
                    })

                    // if (typeof window !== 'undefined') {
                    //     window.location.href = "/auth/signin"
                    // }
                    setFormData(
                        {
                            name: '',
                            email: '',
                            phonenumber: '',
                            password: '',
                            confirmPassword: '',
                            dob: new Date(),
                            gender: '',
                        }
                    )
                } else {
                    toast(response.message, {
                        type: 'error',
                        position: 'top-right',
                        autoClose: 2000
                    });
                }
            })
            .catch((error) => {
                toast(error.message, {
                    type: 'error',
                    position: 'top-right',
                    autoClose: 2000
                });
            })
    }
    return (
        <div className='authout-sigin'>
            <div className='authin-sigin'>
                <div className="left">
                    <Image src={logo} alt="" className='img' />
                </div>
                <div className='right'>
                    <form
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onSubmit={handleSubmit}
                    >
                        <div className="forminput_cont">
                            <div><label>Tên</label></div>
                            <div><input
                                type="text"
                                placeholder="Tên"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span className="formerror">{errors.name}</span>}
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div><label>Số điện thoại</label></div>
                            <div><input
                                type="number"
                                placeholder="Số điện thoại"
                                name="phonenumber"
                                value={formData.phonenumber}
                                onChange={handleChange}
                            />
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div> <label>Email</label></div>
                            <div><input
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <span className="formerror">{errors.email}</span>}
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div><label>Mật khẩu</label></div>
                            <div><input
                                type="password"
                                placeholder="Mật khẩu"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && (
                                <span className="formerror">{errors.password}</span>
                            )}
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div><label>Xác nhận mật khẩu</label></div>
                            <div><input
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && (
                                <span className="formerror">{errors.confirmPassword}</span>
                            )}
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div><label>Ngày sinh</label></div>
                            <div><input
                                type="date"
                                placeholder="Ngày sinh"
                                name="dob"
                                value={formatDate(formData.dob)} // Sử dụng hàm formatDate để chuyển đổi Date thành chuỗi 'YYYY-MM-DD'
                                onChange={handleChange}
                            />
                            {errors.name && <span className="formerror">{errors.name}</span>}
                            </div>
                        </div>
                        <div className="forminput_cont forminput_cont-sex">
                            <div> <label>Giới tính</label></div>
                            <div>
                            <div className="checkbox-container">
                                <div className="checkbox-label">
                                    <label>
                                    <input
                                        type="checkbox"
                                        name="gender"
                                        value="Nam"
                                        checked={formData.gender === "Nam"}
                                        onChange={handleChange}
                                    /> Nam
                                </label>
                                </div>
                                <div className="checkbox-label checkbox-label-right ">
                                <label >
                                    <input
                                        type="checkbox"
                                        name="gender"
                                        value="Nữ"
                                        checked={formData.gender === "Nữ"}
                                        onChange={handleChange}
                                    /> Nữ
                                </label>
                                </div>
                                </div>
                            
                            {errors.gender && <span className="formerror">{errors.gender}</span>}
                            </div>
                        </div>


                        <button type="submit" className="main_button">Đăng ký</button>
                        <p className='authlink'>Bạn đã có tài khoản? <Link href="/auth/signin">Đăng nhập</Link></p>
                    </form>
                </div>

            </div>
            <ToastContainer />

        </div >
    )
}