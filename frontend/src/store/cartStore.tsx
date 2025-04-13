import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: number
  quantity: number
}

interface CartStore {
  cartItems: CartItem[]
  setCartItems: (cartItems: CartItem[]) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartItems: [],
      setCartItems: (cartItems: CartItem[]) => set({ cartItems }),
    }),
    {
      name: 'cart-store', 
    }
  )
)
