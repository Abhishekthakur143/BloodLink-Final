import { useState, useEffect } from 'react';
 
export default function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // localStorage se saved preference check karo
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    // System preference check karo
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
 
  useEffect(() => {
    const root = document.documentElement; // <html> element
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark);
  }, [isDark]);
 
  const toggle = () => setIsDark(prev => !prev);
 
  return { isDark, toggle };
}
 