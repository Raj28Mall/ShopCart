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
  // reviews: number
  inStock: boolean
  details: string
}

interface CartStore {
  products: Product[]
  setCart: (products: Product[]) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      products: [],
      setCart: (products: Product[]) => set({ products }),
    }),
    {
      name: 'cart-store', 
    }
  )
)
