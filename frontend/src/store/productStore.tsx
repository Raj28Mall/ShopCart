import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  shortDescription: string
  longDescription: string
  rating: number
  quantity: number
  details: string[]
}

interface ProductStore {
  products: Product[]
  setProducts: (products: Product[]) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      setProducts: (products: Product[]) => set({ products }),
      searchQuery: '',
      setSearchQuery: (query: string) => set({ searchQuery: query }),
    }),
    {
      name: 'product-store', // localStorage key
    }
  )
)
