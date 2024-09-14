import React from 'react';
import Navbar from '../components/shared/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
        <div className='flex flex-col gap-8 max-w-8xl mx-auto px-4 lg:px-8'>
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Main;