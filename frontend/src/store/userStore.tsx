import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  picture: string;
  role: string;
  status: string;
  dateJoined: string; 
}

interface UserStore {
  user: User
  setUser: (User: User) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: { id:'',  name: '', email: '', picture: '', role:'', status:'', dateJoined: '' },
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'user-store', 
    }
  )
)
