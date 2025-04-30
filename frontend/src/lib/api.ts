import axios from 'axios';
import axiosInstance from '../utils/axiosInstance'; // Use the axiosInstance with interceptors

const API_URL= process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_URL) {
  throw new Error('Backend URL not found');
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

export const getOrderHistory= async()=>{
    const URL=`${API_URL}/order_api/orders`;
    try{
        const response = await axiosInstance.get(URL);
        return response.data;
    } catch(err){
        console.error("Error while fetching order history: ", err);
        return;
    }
};

export const addToOrderHistory= async(totalPrice: number, totalQuantity: number, orderStatus: string, )=>{
    const URL=`${API_URL}/order_api/orders`;
    try{
        const response = await axiosInstance.post(URL, {totalPrice, totalQuantity, orderStatus});
        return response.data;
    } catch(err){
        console.error("Error while processing order: ", err);
        return;
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

export const loginUser = async (email: string, password: string) => {
    const URL=`${API_URL}/api/auth/login`;
    try {
      const response = await axios.post(URL, { email, password });
      return response.data; 
    } catch (error) {
        console.error("Error during login: ", error);
        throw error;
    }
};

export const registerUser = async (name: string, email: string, password: string) => {
    const URL=`${API_URL}/api/auth/register`;
    try {
        const response = await axios.post(URL, { name, email, password });
        return response.data; 
    } catch (error) {
        console.error("Error during registration: ", error);
        throw error;
    }
}

export const addProduct = async (product: { name: string; category: string; price: string; image: File| string; rating?: string; stock: string; shortDescription: string; longDescription: string; status: string;
}) => {
    const URL = `${API_URL}/product_api/products`;
    const productToSend = { ...product, rating: product.rating ?? "0.0", }; //default values
    try {
        const response = await axios.post(URL, productToSend);
        return response.data; 
    } catch (error) {
        console.error("Error while adding product: ", error);
        throw error;
    }
}

export const deleteProduct = async (productId: string) => {
    const URL = `${API_URL}/product_api/products/${productId}`;
    try {
        const response = await axios.delete(URL);
        return response.data; 
    } catch (error) {
        console.error("Error while deleting product: ", error);
        throw error;
    }
}