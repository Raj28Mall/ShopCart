import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product { 
  id: string;
  name: string;
  category: string;
  price: string; 
  image: string;
  rating?: string; 
  stock: number; 
  shortDescription: string;
  longDescription: string;
  status: string; 
}

interface ProductStore {
  products: Product[]
  setProducts: (products: Product[]) => void
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      setProducts: (products: Product[]) => set({ products }),
    }),
    {
      name: 'product-store', // localStorage key
    }
  )
)
