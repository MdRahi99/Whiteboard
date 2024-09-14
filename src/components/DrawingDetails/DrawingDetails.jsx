import React from 'react';
import { useParams } from 'react-router-dom';

const DrawingDetails = () => {

    const params = useParams();
    
    return (
        <div>
            Id: {params.id}
        </div>
    );
};

export default DrawingDetails;