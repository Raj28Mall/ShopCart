export interface Product{ 
    id: string;
    name: string;
    category: string;
    price: string; 
    image: File | string;
    rating?: string; 
    stock: number; 
    shortDescription: string;
    longDescription: string;
    status: string; 
  }
  
export interface Banner {
    id: string; 
    title: string;
    image_url: string; 
    active: string;
    created_at?: string; 
}

export interface ProductDetails {
  parameter: string;
  detail: string;
}

