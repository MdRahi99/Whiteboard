import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen gap-8'>
            <h3 className='text-2xl font-semibold'>404 Not Found</h3>
            <Link to='/' className='px-4 py-1 rounded-lg border-2 border-orange-400 hover:border-orange-500 bg-orange-400 hover:bg-orange-500 text-white'>Back to Home</Link>
        </div>
    );
};

export default Error;