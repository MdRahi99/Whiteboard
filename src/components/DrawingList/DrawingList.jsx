import React from 'react';
import { useDrawings } from '../../hooks/useDrawings';
import { Link } from 'react-router-dom';
import Loading from '../shared/Loading/Loading';
import { FaPencilAlt, FaShapes, FaFont } from 'react-icons/fa';
import DrawingPreview from '../DrawingPreview/DrawingPreview';

const DrawingList = () => {
    const { data, isLoading } = useDrawings();

    if (isLoading) return <Loading />;

    return (
        <div className="container mx-auto px-2 py-6">
            <h1 className="text-xl font-semibold mb-6 text-gray-700">All Drawings</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {data?.map((drawing) => (
                    <Link to={`/drawings/${drawing._id}`} key={drawing._id} className="relative group">
                        <div className="bg-white rounded-md border-2 border-indigo-100 overflow-hidden transition-all duration-300">
                            {/* Preview Canvas */}
                            <div className="relative aspect-square bg-gray-100">
                                <DrawingPreview drawing={drawing} />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-medium p-2">
                                    <div className="text-center">
                                        <h2 className="text-md font-semibold mb-1">{drawing.title}</h2>
                                        <p>{new Date(drawing.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="px-2 py-3 bg-gray-50 flex justify-between items-center text-gray-600 text-xs">
                                <div className="flex items-center space-x-2">
                                    <span className="flex items-center">
                                        <FaPencilAlt className="text-indigo-500 pr-1" /> {drawing.lines.length}
                                    </span>
                                    <span className="flex items-center">
                                        <FaShapes className="text-indigo-500 pr-1" /> {drawing.shapes.length}
                                    </span>
                                    <span className="flex items-center">
                                        <FaFont className="text-indigo-500 pr-1" /> {drawing.texts.length}
                                    </span>
                                </div>
                                <Link to={`/drawings/${drawing._id}`} className="text-indigo-500 font-semibold hover:text-indigo-800">View</Link>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DrawingList;
