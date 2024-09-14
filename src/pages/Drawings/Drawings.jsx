import React from 'react';
import Loading from '../../components/shared/Loading/Loading';

const Drawings = () => {
    const loading = true;

    if(loading){
        return <Loading />
    }
    return (
        <div className='text-4xl text-center'>
            Drawings
        </div>
    );
};

export default Drawings;