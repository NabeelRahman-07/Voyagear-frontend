import React from 'react'
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import { ToastContainer } from 'react-toastify';

function App() {


  return (
    <>
      <ToastContainer 
      autoClose={2000}
      />
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </>

  )
}

export default App