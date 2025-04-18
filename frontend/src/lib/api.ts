import axios from 'axios';

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

export const getOrderHistory= async(userId: string)=>{
    const URL=`${API_URL}/order_api/orders`;
    try{
        const response = await axios.get(URL, { params: { userId } });
        return response.data;
    } catch(err){
        console.error("Error while fetching order history: ", err);
        return;
    }
};

export const addToOrderHistory= async(userId: string, totalPrice: number, totalQuantity: number, orderStatus: string, )=>{
    const URL=`${API_URL}/order_api/orders`;
    try{
        const response = await axios.post(URL, {userId, totalPrice, totalQuantity, orderStatus});
        return response.data;
    } catch(err){
        console.error("Error while processing order: ", err);
        return;
    }
}

export const addOrderProduct = async( orderId: string, products: Array<{ productId: number; productName: string; productImage: string; productPrice: number; productQuantity: number; }> ) => {
    const URL = `${API_URL}/order_api/order_products`;
    try {
        const response = await axios.post(URL, { orderId, products });
        return response.data;
    } catch (err) {
        console.error("Error while adding order products: ", err);
        return;
    }
}

export const getOrderProducts= async(orderId: string)=>{
    const URL=`${API_URL}/order_api/order_products`;
    try{
        const response = await axios.get(URL, { params: { orderId } });
        return response.data;
    } catch(err){
        console.error("Error while fetching order products: ", err);
        return;
    }
}