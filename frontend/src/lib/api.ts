import axios from 'axios';

const API_URL= process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_URL) {
  throw new Error('Backend URL not found');
}

export const getProducts = async()=>{
    const URL=`${API_URL}/api/products`;
    try{
        const response = await axios.get(URL);
        return response.data;
    } catch(err){
        console.error("Error while fetching products: ", err);
        return;
    }
}