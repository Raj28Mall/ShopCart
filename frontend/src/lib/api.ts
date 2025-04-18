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

export const getOrderHistory= async()=>{
    const URL=`${API_URL}/order_api/orders`;
    try{
        const response = await axios.get(URL);
        return response.data;
    } catch(err){
        console.error("Error while fetching order history: ", err);
        return;
    }
};

export const addToOrderHistory= async(userId: number, productId: number, orderNo: string, quantity: number)=>{
    const URL=`${API_URL}/order_api/orders`;
    try{
        const response = await axios.post(URL, {userId, productId, orderNo, quantity});
        return response.data;
    } catch(err){
        console.error("Error while processing order: ", err);
        return;
    }
}