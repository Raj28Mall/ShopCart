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
  quantity: number
  // reviews: number
  details: string
}

interface CartStore {
  cartItems: Product[]
  setCartItems: (cartItems: Product[]) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartItems: [],
      setCartItems: (cartItems: Product[]) => set({ cartItems }),
    }),
    {
      name: 'cart-store', 
    }
  )
)
