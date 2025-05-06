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
  