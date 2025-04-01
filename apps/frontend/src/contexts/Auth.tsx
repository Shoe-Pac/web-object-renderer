import { createContext, useState } from 'react'

interface AuthContextType {
  userId: string | null
  userEmail: string | null
  setUserId: React.Dispatch<React.SetStateAction<string | null>>
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  return (
    <AuthContext.Provider value={{ userId, userEmail, setUserId, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
