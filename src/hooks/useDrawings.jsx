import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllDrawings, getDrawingById, createDrawing, updateDrawing, deleteDrawing } from '../api/api';

export const useDrawings = () => {
    return useQuery({
        queryKey: ['drawings'],
        queryFn: getAllDrawings,
    });
};

export const useDrawing = (id) => {
    return useQuery({
        queryKey: ['drawing', id],
        queryFn: () => getDrawingById(id),
    });
};

export const useCreateDrawing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDrawing,
        onSuccess: () => {
            queryClient.invalidateQueries(['drawings']);
        },
    });
};

export const useUpdateDrawing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateDrawing(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['drawings']);
        },
    });
};

export const useDeleteDrawing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteDrawing,
        onSuccess: () => {
            queryClient.invalidateQueries(['drawings']);
        },
    });
};
