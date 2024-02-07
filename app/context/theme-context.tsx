'use client'

import React, { useEffect, useState, createContext, useContext } from 'react'

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} })

export default function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
      window.localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
    } else {
      setTheme('light')
      window.localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme')

    if (localTheme) {
      setTheme(localTheme)

      if (localTheme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  return context
}
