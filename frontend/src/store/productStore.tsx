import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  description: string
  rating: number
  variant?: string
  // reviews: number
  details: string
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
      name: 'product-store', //localstorage key
    }
  )
)
