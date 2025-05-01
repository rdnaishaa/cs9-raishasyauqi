// Theme.js - Core design system file
// Purple-based color palette with complementary colors

const Theme = {
  colors: {
    primary: {
      main: '#6200EA',
      light: '#B388FF',
      dark: '#4A148C',
      contrast: '#FFFFFF'
    },
    secondary: {
      main: '#00BCD4',
      light: '#B2EBF2',
      dark: '#0097A7',
      contrast: '#FFFFFF'
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF'
    },
    neutral: {
      black: '#263238',
      darkGray: '#455A64',
      gray: '#78909C',
      lightGray: '#CFD8DC'
    },
    semantic: {
      success: '#4CAF50',
      error: '#F44336'
    }
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  typography: {
    fontFamily: "'Inter', sans-serif"
  }
};

export default Theme;