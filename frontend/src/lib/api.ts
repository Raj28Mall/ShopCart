/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance'; // Use the axiosInstance with interceptors

const API_URL= process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_URL) {
    throw new Error('Backend URL not found');
}
export const loginUser = async (email: string, password: string, role:string) => {
    const URL=`${API_URL}/api/auth/login`;
    try {
      const response = await axios.post(URL, { email, password, role });
      return response.data; 
    } catch (error) {
        throw error;
    }
};

export const signupUser = async (name: string, email: string, password: string, confirmPassword: string, role:string) => {
    const URL=`${API_URL}/api/auth/signup`;
    try {
        const response = await axios.post(URL, { name, email, password, confirmPassword, role});
        return response.data; 
    } catch (error) {
        console.error("Error during signup: ", error);
        throw error;
    }
}

export const authStatus = async () => {
    const URL=`${API_URL}/api/auth/status`;
    try {
        const response = await axiosInstance.get(URL);
        return response.data; 
    } catch (error: any) {
        console.error("API call to /api/auth/status failed: ", error);
        if (axios.isAxiosError(error) && error.response && error.response.data) {
            throw {
                message: error.response.data.message || "Failed to get auth status from server",
                status: error.response.status,
                data: error.response.data
            };
        }
        throw new Error(error.message || "An unexpected error occurred while fetching auth status.");
    }
}

export const getAdmins = async (status: string) => {
    let URL=`${API_URL}/user_api/admins`;
    if(status){
        URL += `?status=${status}`;
    }
    try {
        const response = await axiosInstance.get(URL);
        return response.data; 
    } catch (error) {
        throw error;
    }
}

export const adminApproval = async (email: string, status: string) => {
    const URL=`${API_URL}/user_api/admins/${email}/${status}`;
    try {
        const response = await axiosInstance.get(URL);
        return response.data; 
    } catch (error) {
        console.error("Error during admin approval: ", error);
        throw error;
    }
}

export const getProduct= async(productId: string)=>{
    const URL=`${API_URL}/product_api/products/${productId}`;
    try{
        const response = await axios.get(URL);
        return response.data;
    } catch(err){
        console.error("Error while fetching product in backend: ", err);
        return;
    }
}

export const getProducts = async()=>{
    const URL=`${API_URL}/product_api/products`;
    try{
        const response = await axios.get(URL);
        return response.data;
    } catch(err){
        console.error("Error while fetching products in backend: ", err);
        return;
    }
};



export const addProduct = async (product: { name: string; category: string; price: string; image: File | string;  rating?: string; stock: string; shortDescription: string; longDescription: string; status: string;}) => {
    const URL = `${API_URL}/product_api/products`; 
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category', product.category);
    formData.append('price', product.price);
    formData.append('stock', product.stock);
    formData.append('shortDescription', product.shortDescription);
    formData.append('longDescription', product.longDescription);
    formData.append('status', product.status);
    formData.append('rating', product.rating ?? "0.0");
    if (product.image instanceof File) {
        formData.append('image', product.image, product.image.name); 
    } else if (typeof product.image === 'string') {
        console.warn("addProduct called with an image string. The backend expects a File upload in the 'image' field for this endpoint.");
    }
    
    try {
        const response = await axiosInstance.post(URL, formData, {});
        return response.data; 
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error adding product:", error.response?.status, error.response?.data || error.message);
        } else {
            console.error("Error while adding product: ", error);
        }
        throw error; 
    }
}

export const editProduct = async (productId: string, product: { name: string; category: string; price: string; image: File | string; rating?: string; stock: string; shortDescription: string; longDescription: string; status: string;}) => {
    const URL = `${API_URL}/product_api/products/${productId}`;
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category', product.category);
    formData.append('price', product.price);
    formData.append('stock', product.stock);
    formData.append('shortDescription', product.shortDescription);
    formData.append('longDescription', product.longDescription);
    formData.append('status', product.status);
    formData.append('rating', product.rating ?? "0.0");
    
    if (product.image instanceof File) {
        formData.append('image', product.image);
    }
    
    try {
        const response = await axiosInstance.put(URL, formData, {});
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error editing product:", error.response?.status, error.response?.data || error.message);
        } else {
            console.error("Error while editing product: ", error);
        }
        throw error;
    }
}

export const deleteProduct = async (productId: string) => {
    const URL = `${API_URL}/product_api/products/${productId}`;
    try {
        const response = await axiosInstance.delete(URL);
        return response.data; 
    } catch (error) {
        console.error("Error while deleting product: ", error);
        throw error;
    }
}


export const getOrderHistory= async()=>{
    const URL=`${API_URL}/order_api/orders`;
    try{
        const response = await axiosInstance.get(URL);
        return response.data;
    } catch(err){
        console.error("Error while fetching order history: ", err);
        throw err; 
    }
};

export const addToOrderHistory= async(totalPrice: number, totalQuantity: number, orderStatus: string)=>{
    const URL=`${API_URL}/order_api/orders`;
    try{
        const response = await axiosInstance.post(URL, {totalPrice, totalQuantity, orderStatus});
        return response.data;
    } catch(err){
        console.error("Error while processing order: ", err);
        throw err; 
    }
}

export const addOrderProduct = async( orderId: string, products: Array<{ productId: number; productName: string; productImage: string; productPrice: number; productQuantity: number; }> ) => {
    const URL = `${API_URL}/order_api/order_products`;
    try {
        const response = await axiosInstance.post(URL, { orderId, products });
        return response.data;
    } catch (err) {
        console.error("Error while adding order products: ", err);
        return;
    }
}

export const getOrderProducts= async(orderId: string)=>{
    const URL=`${API_URL}/order_api/order_products`;
    try{
        const response = await axiosInstance.get(URL, { params: { orderId } });
        return response.data;
    } catch(err){
        console.error("Error while fetching order products: ", err);
        return;
    }
}