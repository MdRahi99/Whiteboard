import React from 'react';
import Loading from '../../components/shared/Loading/Loading';
import { useDrawings } from '../../hooks/useDrawings';

const Drawings = () => {
    const { data, isLoading } = useDrawings();

    if (isLoading) return <Loading />;

    return (
        <div className='text-4xl text-center'>
            Drawings {data.length}
        </div>
    );
};

export default Drawings;