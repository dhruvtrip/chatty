import { create } from 'zustand'

const useAuthStore = create(set => ({
  username: '',
  setUsername: username => set({ username })
}))

export default useAuthStore