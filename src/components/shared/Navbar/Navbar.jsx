import React from 'react';
import { Link } from 'react-router-dom';
import ResponsiveMenu from 'react-responsive-navbar';
import { FaHome, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa';
import { RiPencilRuler2Line } from 'react-icons/ri';

const Navbar = () => {
    return (
        <ResponsiveMenu
            menuOpenButton={<FaBars className="text-gray-600 text-2xl" />}
            menuCloseButton={<FaTimes className="text-gray-600 text-2xl" />}
            changeMenuOn="md"
            largeMenuClassName="large-menu-classname"
            smallMenuClassName="small-menu-classname"
            menu={
                <nav>
                    <div className="flex justify-between h-16 items-center bg-gradient-to-b from-indigo-100 to-indigo-100 p-2 rounded-xl mt-2">
                        <div className="flex-shrink-0 flex items-center">
                            <RiPencilRuler2Line className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-2xl font-bold text-gray-800">Whiteboard</span>
                        </div>

                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <Link
                                to="/"
                                className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                            >
                                <FaHome className="mr-1" />
                                Home
                            </Link>
                        </div>

                        <div className="hidden md:flex md:items-center">
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                            >
                                <FaSignInAlt className="mr-2" />
                                Login
                            </button>
                        </div>
                    </div>
                </nav>
            }
        />
    );
};

export default Navbar;