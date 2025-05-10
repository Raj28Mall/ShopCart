import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  picture: string;
  role: string;
}

interface UserStore {
  user: User
  setUser: (User: User) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: { id:'',  name: '', email: '', picture: '', role:'user' },
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'user-store', 
    }
  )
)
