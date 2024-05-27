'use client'
import Link from 'next/link'
import React from 'react'
import './Navbar.css'
import { BiUserCircle, BiSearch } from 'react-icons/bi'
import { RiArrowDropDownFill } from 'react-icons/ri'
import logo from '@/assets/logo.png'
import Image from 'next/image'
import LocationPopup from '@/popups/location/LocationPopup'
import NotificationMenu from '@/components/NotificationMenu'


const Navbar = () => {
    const [showLocationPopup, setShowLocationPopup] = React.useState<boolean>(false)
    const [user, setUser] = React.useState<any>(null)
    const [loggedIn, setLoggedIn] = React.useState<boolean>(false)
    const [googleUser, setGoogleUser] = React.useState<any>(null)
    
    const getGoogleUser = async () => {

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login/success`, {
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
                setGoogleUser(response.data)
                
            })
            .catch((error) => {
                console.log(error)
                console.log("Hiiiiiiiiiiiiiii")
            })
    }

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
                setUser(response.data)
                
            })
            .catch((error) => {
                console.log(error)
                console.log("Hiiiiiiiiiiiiiii")
            })
    }

    const handleGoolgeLogout = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/goolelogout`, {
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
                    if (typeof window !== 'undefined') {
                        window.location.href = "/auth/signin"
                    }
                }

            })
            .catch((error) => {
                console.log(error)
                if (typeof window !== 'undefined') {
                    window.location.href = "/auth/signin"
                }
            })

      };

    const handleLogout = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/logout`, {
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
                    if (typeof window !== 'undefined') {
                        window.location.href = "/auth/signin"
                    }
                }

            })
            .catch((error) => {
                console.log(error)
                if (typeof window !== 'undefined') {
                    window.location.href = "/auth/signin"
                }
            })

        
    }

    const checkLogin = async () => {
        // let authToken = await getCookie('authToken')
        // let refreshToken = await getCookie('refreshToken')

        // console.log(authToken, refreshToken)
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/checklogin`, {
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
                    setLoggedIn(true)
                }
                else {
                    setLoggedIn(false)
                }
            })
            .catch((error) => {
                console.log(error)
                setLoggedIn(false)
            })
    }
  

    React.useEffect(() => {
        checkLogin()
        
        getuser()
        getGoogleUser()
        // getKnockClient()
    }, [])
    
    return (
        <nav>
            <div className='left'>
                <Image src={logo} alt="logo" width={100} height={100}
                    onClick={() => window.location.href = "/"}
                />

            </div>

            <div className='right'>
                {loggedIn && user ? (

                    <div className="user-info">
                        <a className="q" style={{ cursor: 'pointer' }} href="/promotion">Tin tức, ưu đãi</a>

                        <div className='fd'><BiUserCircle className='theme_icon1' /></div>
                        <a href='/profile'>Xin chào, {user.name}! </a>
                        {/* <NotificationMenu></NotificationMenu> */}
                        <button className='theme_btn1 linkstylenone' style={{ cursor: 'pointer' }} onClick={handleLogout}>Đăng xuất</button>
                    </div>
                ) : 
                (
                    <>
                     
                      { googleUser ? (
                        <>
                        <div className="user-info">
                         <a className="q" style={{ cursor: 'pointer' }} href="/promotion">Tin tức, ưu đãi</a>
                        <div className='fd'><BiUserCircle className='theme_icon1' /></div>
                        <a href='/profile'>Xin chào, {googleUser.displayName}! </a>
                        {/* <NotificationMenu></NotificationMenu> */}
                        <button className='theme_btn1 linkstylenone' style={{ cursor: 'pointer' }} onClick={handleGoolgeLogout}>Đăng xuất</button>
                        </div>
                      </>
                ) : 
                (
                    <div className="user-info">
                    <a className="q" style={{ cursor: 'pointer' }} href="/promotion">Tin tức, ưu đãi</a>
                    <Link href="/auth/signin" className='theme_btn1 linkstylenone'>

                        Đăng nhập
                    </Link>
                   </div>
                      )}
                    </>
                  )}

            </div>
            {
                showLocationPopup &&
                <LocationPopup
                    setShowLocationPopup={setShowLocationPopup}
                />
            }
        </nav>
    )
}

export default  Navbar