'use client'

import { useTheme } from '@/app/context/theme-context'
import { MdLightMode, MdDarkMode } from 'react-icons/md'

export default function ThemeSwitch() {
  const themeContext = useTheme()
  const theme = themeContext?.theme
  const toggleTheme = themeContext?.toggleTheme

  return (
    <button
      className='mr-2 shadow-2xl hover:scale-[1.15] active:scale-105 transition-all'
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <MdLightMode size={20} color='#000' />
      ) : (
        <MdDarkMode size={20} color='#fff' />
      )}
    </button>
  )
}
