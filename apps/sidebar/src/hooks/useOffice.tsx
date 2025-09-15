import React, { createContext, useContext } from 'react'

interface OfficeContextType {
  isOfficeReady: boolean
  isLoading: boolean
  error: string | null
}

export const OfficeContext = createContext<OfficeContextType>({
  isOfficeReady: false,
  isLoading: false,
  error: null
})

export const useOffice = () => {
  const context = useContext(OfficeContext)
  if (!context) {
    throw new Error('useOffice должен использоваться внутри OfficeContext.Provider')
  }
  return context
}
