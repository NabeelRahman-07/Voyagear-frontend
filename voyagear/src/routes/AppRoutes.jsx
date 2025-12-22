import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import Home from '../pages/home/home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import { AuthProvider } from '../context/AuthContext'
import Products from '../pages/products/Product'
import ProductDetails from '../pages/productDetails/ProductDetails'
import { CartProvider } from '../context/CartContext'
import Cart from '../pages/cart/Cart'
import Payment from '../pages/payment/Payment'
import { PaymentProvider } from '../context/PaymentContext'
import Orders from '../pages/orders/Orders'
import { WishlistProvider } from '../context/WishlistContext'
import Wishlist from '../pages/wishlist/Wishlist'
import About from '../pages/about/About'
import PageNotFound from '../pages/notfound/PageNotFound'


function AppRoutes() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <PaymentProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/products' element={<Products />} />
                <Route path='/products/:id' element={<ProductDetails />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/wishlist' element={<Wishlist />} />
                <Route path='/checkout' element={<Payment />} />
                <Route path='/orders' element={<Orders />} />
                <Route path='/about' element={<About />} />
                <Route path='*' element={<PageNotFound/>}/>
              </Route>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
            </Routes>
          </PaymentProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default AppRoutes