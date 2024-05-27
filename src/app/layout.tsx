import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar/Navbar'
import {Knock} from '@knocklabs/node'
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next"
import Email from 'next-auth/providers/email'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SGP Cinema',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) 
  
{
  // const knockClient = new Knock("sk_test_CxObjuVUM9OkqeH58OrwTcHl-15km9uxc6nouPtGJqM");
  // const userId = "123";
  // const name = "huyen" ;
  // const email = "dothuyduong@gmail.com"
  // const knockUser = await knockClient.users.identify(userId, {
  //   name: name ,
  //   email : email
  // });
  // console.log(knockUser) ;
 
  // const knockClient= new Knock("sk_test_CxObjuVUM9OkqeH58OrwTcHl-15km9uxc6nouPtGJqM");
        // const otherUsers = await User.find();
       
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  )
}
