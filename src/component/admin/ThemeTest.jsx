import React from 'react';
import { useTheme, ThemeProvider } from '../header/ThemeContext';

const ThemeTest = () => {
  const themeContext = useTheme();
  console.log('Theme context:', themeContext);
  
  return (
    <div>
      <h2>Theme Test</h2>
      <p>isDarkMode: {themeContext && themeContext.isDarkMode ? 'true' : 'false'}</p>
      <p>currentLanguage: {themeContext && themeContext.currentLanguage}</p>
      <button onClick={themeContext && themeContext.toggleDarkMode}>Toggle Theme</button>
    </div>
  );
};

const ThemeTestWrapper = () => {
  return (
    <ThemeProvider>
      <ThemeTest />
    </ThemeProvider>
  );
};

export default ThemeTestWrapper; 