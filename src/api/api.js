import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getAllDrawings = async () => {
    const { data } = await api.get('/drawings');
    return data;
};

export const getDrawingById = async (id) => {
    const { data } = await api.get(`/drawings/${id}`);
    return data;
};

export const createDrawing = async (data) => {
    const { data: responseData } = await api.post('/drawings', data);
    return responseData;
};

export const updateDrawing = async (id, data) => {
    const { data: responseData } = await api.put(`/drawings/${id}`, data);
    return responseData;
};

export const deleteDrawing = async (id) => {
    const { data: responseData } = await api.delete(`/drawings/${id}`);
    return responseData;
};
