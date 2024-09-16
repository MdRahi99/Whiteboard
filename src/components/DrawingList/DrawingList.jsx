import React from 'react';
import { useDeleteDrawing, useDrawings } from '../../hooks/useDrawings';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../shared/Loading/Loading';
import { FaPencilAlt, FaShapes, FaFont } from 'react-icons/fa';
import DrawingPreview from '../DrawingPreview/DrawingPreview';
import { toast, ToastContainer } from 'react-toastify';
import { MdOutlineDelete } from "react-icons/md";

const DrawingList = () => {
    const { data, isLoading } = useDrawings();
    const deleteDrawingMutation = useDeleteDrawing();
    const navigate = useNavigate();

    const handleDelete = async (id, event) => {
        event.stopPropagation();
        try {
            await deleteDrawingMutation.mutateAsync(id);
            toast.success('Drawing deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete drawing. Please try again.');
        }
    };

    const handleViewDetails = (id, event) => {
        event.stopPropagation();
        navigate(`/drawings/${id}`);
    };

    if (isLoading) return <Loading />;

    return (
        <div className="container mx-auto px-2 py-6">
            <ToastContainer position="top-center" autoClose={1000} />
            <h1 className="text-xl font-semibold mb-6 text-gray-700">All Drawings</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {data?.map((drawing) => (
                    <div key={drawing._id} className="relative group">
                        {/* Delete Button */}
                        <button
                            onClick={(event) => handleDelete(drawing?._id, event)}
                            className='absolute -right-2 -top-2 z-30 flex items-center gap-1 bg-indigo-500 hover:bg-red-500 text-white p-1 rounded-full'
                            disabled={deleteDrawingMutation.isLoading}
                        >
                            <MdOutlineDelete className='text-lg' />
                        </button>

                        <div className="bg-gradient-to-t from-indigo-50 to-indigo-100 rounded-md overflow-hidden transition-all duration-300">
                            {/* Preview Canvas */}
                            <div className="relative aspect-square">
                                <DrawingPreview drawing={drawing} height={280} width={350} />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gray-700 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-medium p-2">
                                    <div className="text-center">
                                        <h2 className="text-md font-semibold mb-1">{drawing.title}</h2>
                                        <p>{new Date(drawing.createdAt).toLocaleDateString()}</p>
                                        {/* View Button */}
                                        <button
                                            onClick={(event) => handleViewDetails(drawing._id, event)}
                                            className="mt-2 bg-indigo-600 hover:bg-indigo-800 text-white py-1 px-4 rounded"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="px-3 py-2 bg-gradient-to-r from-indigo-400 to-indigo-400 flex justify-between items-center text-white text-sm">
                                <div className="flex items-center space-x-2">
                                    <span className="flex items-center">
                                        <FaPencilAlt className="pr-1" /> {drawing.lines.length}
                                    </span>
                                    <span className="flex items-center">
                                        <FaShapes className="pr-1" /> {drawing.shapes.length}
                                    </span>
                                    <span className="flex items-center">
                                        <FaFont className="pr-1" /> {drawing.texts.length}
                                    </span>
                                </div>

                                <button
                                    onClick={(event) => handleViewDetails(drawing._id, event)}
                                    className="bg-indigo-600 hover:bg-indigo-800 text-white py-1 px-4 rounded"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DrawingList;
