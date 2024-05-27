'use client'
import Image from 'next/image'
import styles from './page.module.css'
import HomeSlider from '@/components/HomeSlider/HomeSlider'
import MovieCarousel from '@/components/MovieCarousel/MovieCarousel'


export default function Home() {
  return (
    <main className={styles.main}>
      <div className='q'><h2></h2></div>
      <HomeSlider />
      <div className='z'><h2>PHIM ĐANG CHIẾU</h2></div>
      <MovieCarousel />
    </main >
  )
}
