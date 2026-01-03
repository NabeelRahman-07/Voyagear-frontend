import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { removeUser } from '../../components/common/StorageService';
import logo from '../../assets/logo.png'
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function AdminNavbar({ toggleSidebar }) {
    const navigate = useNavigate();
    const {logout}=useContext(AuthContext);

    const handleLogout = () => {
        // Clear admin session
        logout();
        toast.success("User logged out!")
        navigate('/login',{replace:true});
    };

    return (
        <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-14">
            <div className="h-full px-4 flex items-center justify-between">

                {/* Left: Menu & Brand */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleSidebar}
                        className="p-1.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                        aria-label="Toggle menu"
                    >
                        <FaBars />
                    </button>

                    {/* Brand */}
                    <Link to="/admin" className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <img
                                src={logo}
                                alt="Voyagear Logo"
                                className="w-full h-full object-contain rounded-3xl group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <span className="ml-2 font-semibold text-gray-800">
                            Admin
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {/* Store Link */}
                    <button
                        onClick={() => {
                            navigate('/',{replace:true});
                        }}
                        className="p-1.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                        title="View Store"
                    >
                        <FaHome />
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Logout"
                    >
                        <FaSignOutAlt />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavbar;