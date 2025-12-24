import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import logo from '../../assets/logo.png'
import { FaHeart, FaShoppingCart, FaUser, FaBox, FaCog, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const cartQuantity = user?.cart.reduce((sum, item) => (sum += item.quantity), 0)


  return (
    <nav className="h-[80px] bg-background flex items-center justify-between px-6 md:px-10 opacity-95 sticky top-0 z-50 shadow-lg border-b border-gray-100">

      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 flex items-center justify-center">
          <img
            src={logo}
            alt="Voyagear Logo"
            className="w-full h-full object-contain rounded-3xl group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-primary text-2xl font-bold tracking-wide">
            Voyagear
          </span>
          <span className="text-secondary text-xs font-medium tracking-widest uppercase">
            Explore Beyond
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-10">
        {[
          { path: "/", name: "Home" },
          { path: "/products", name: "Products" },
          { path: "/about", name: "About" },
        ].map((item) => (
          <div key={item.path} className="relative group">
            <NavLink
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `text-primary text-base font-medium transition-all duration-300 ${isActive
                  ? "text-secondary font-bold"
                  : "hover:text-accent"
                }`
              }
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300"></span>
            </NavLink>
            {/* Active indicator - only shows when active */}
            <NavLink
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${isActive ? "w-full bg-secondary" : "w-0"
                }`
              }
            >
              {/* This empty NavLink is just for the active indicator */}
            </NavLink>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Wishlist with original icon */}
        <div className="relative group">
          <Link
            to="/wishlist"
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-red-500 transition-colors"
            title="Wishlist"
          >
            <FaHeart className="text-xl" />
            {user?.wishlist?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {user.wishlist.length}
              </span>
            )}
          </Link>
          <div className="absolute -bottom-9 right-0 bg-primary text-background px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm shadow-lg pointer-events-none">
            Wishlist
          </div>
        </div>

        {/* Cart with original icon */}
        <div className="relative group">
          <Link
            to="/cart"
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-secondary transition-colors"
            title="Cart"
          >
            <FaShoppingCart className="text-xl" />
            {/* Cart Counter Badge */}
            {user?.cart?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartQuantity}
              </span>
            )}
          </Link>
          <div className="absolute -bottom-9 right-0 bg-primary text-background px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm shadow-lg pointer-events-none">
            Cart {user?.cart?.length > 0 && `(${user.cart.length})`}
          </div>
        </div>

        {/* User Actions */}
        {!user ? (
          <Link
            to="/login"
            className="bg-secondary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Login
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-primary font-medium hidden lg:block">
                {user.name || user.email.split("@")[0]}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Enhanced Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl py-3 z-50 border border-gray-100 overflow-hidden animate-fadeIn">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-primary">{user.name || user.email.split("@")[0]}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-secondary/10 transition-colors duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FaBox className="text-gray-500" />
                    <span>My Orders</span>
                  </Link>
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 transition-colors duration-200"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button className="md:hidden text-primary text-2xl hover:text-secondary transition-colors">
          ☰
        </button>
      </div>
    </nav>
  );
}

export default Navbar;