import React from 'react'
import Navbar from '../common/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../common/footer'

function MainLayout() {
  return (
    <>
    <Navbar/>
    <main className="bg-background min-h-screen">
        <Outlet/>
    </main>
    <Footer/>
    </>
  )
}

export default MainLayout