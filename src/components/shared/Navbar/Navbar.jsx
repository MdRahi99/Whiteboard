import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { FaSignInAlt, FaBars } from 'react-icons/fa';
import { VscCheckAll } from "react-icons/vsc";
import { BiSolidMessageEdit } from "react-icons/bi";
import { RiPencilRuler2Line } from 'react-icons/ri';

const Navbar = () => {
    const location = useLocation();
    
    const getLinkClass = (path) => {
        return location.pathname === path
            ? 'text-indigo-600 font-semibold'
            : 'text-gray-600 hover:text-indigo-600';
    };
    
    return (
        <div className="sticky top-0 bg-white z-50">
            <div className="flex justify-between items-center h-16 border-b border-indigo-200 p-2 rounded-xl">
                <Link to='/' className="flex-shrink-0 flex items-center">
                    <RiPencilRuler2Line className="h-8 w-8 text-indigo-600" />
                    <span className="ml-2 text-2xl font-bold text-gray-800">Whiteboard</span>
                </Link>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Menu
                        right
                        noOverlay
                        customBurgerIcon={<FaBars className="text-gray-600 text-2xl" />}
                        burgerBarClassName="bg-gray-600"
                        className="mobile-menu"
                        menuClassName="bg-white text-gray-800"
                    >
                        <nav className="flex flex-col p-4">
                            <Link
                                to="/"
                                className={`text-sm font-medium flex items-center gap-2 rounded-md p-2 ${getLinkClass('/')}`}
                            >
                                <VscCheckAll className="text-lg" />
                                <span>All Drawings</span>
                            </Link>
                            <Link
                                to="/add-drawings"
                                className={`text-sm font-medium flex items-center gap-2 rounded-md p-2 ${getLinkClass('/add-drawings')}`}
                            >
                                <BiSolidMessageEdit className="text-lg" />
                                <span>Add Drawings</span>
                            </Link>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 mt-4"
                            >
                                <FaSignInAlt className="mr-2" />
                                Login
                            </button>
                        </nav>
                    </Menu>
                </div>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex md:ml-6 md:space-x-12 items-center">
                    <Link
                        to="/"
                        className={`text-sm font-medium flex items-center justify-center gap-1 rounded-md ${getLinkClass('/')}`}
                    >
                        <VscCheckAll className="text-lg mt-1" />
                        <span>All Drawings</span>
                    </Link>
                    <Link
                        to="/add-drawings"
                        className={`text-sm font-medium flex items-center justify-center gap-1 rounded-md ${getLinkClass('/add-drawings')}`}
                    >
                        <BiSolidMessageEdit className="text-lg mt-1" />
                        <span>Add Drawings</span>
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
        </div>
    );
};

export default Navbar;
