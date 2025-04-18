import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Order {
    userId: string
    orderId: string
    orderDate: string
    orderStatus: string
    totalPrice: number
    totalQuantity: number
}

interface OrderStore {
  orders: Order[]
  setOrders: (orders: Order[]) => void
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      setOrders: (orders: Order[]) => set({ orders }),
    }),
    {
      name: 'order-store', // localStorage key
    }
  )
)
