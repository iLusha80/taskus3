import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    background: '#FFFFFF',
    backgroundLight: '#F4F5F7',
    text: '#282C34',
    primary: '#007BFF',
    success: '#28A745',
    danger: '#DC3545',
    grayLight: '#E0E0E0',
    grayMedium: '#CCCCCC',
    grayDark: '#666666',
    white: '#FFFFFF', // Using white explicitly for some elements if needed
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    heading1: {
      fontSize: '2.5em',
      fontWeight: '700',
    },
    heading2: {
      fontSize: '2em',
      fontWeight: '700',
    },
    heading3: {
      fontSize: '1.5em',
      fontWeight: '600',
    },
    body: {
      fontSize: '1em',
      lineHeight: '1.6',
    },
    small: {
      fontSize: '0.9em',
      color: '#666666', // Using a specific gray for small text
    },
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px', // For cards
  },
  boxShadow: {
    small: '0 1px 3px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 10px rgba(0, 0, 0, 0.15)',
    large: '0 8px 20px rgba(0, 0, 0, 0.2)', // For card hover
  },
  transitions: {
    easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  }
};

// This GlobalStyles component will be defined in GlobalStyles.js
// export const GlobalStyles = createGlobalStyle`
//   body {
//     margin: 0;
//     padding: 0;
//     font-family: ${({ theme }) => theme.typography.fontFamily};
//     background-color: ${({ theme }) => theme.colors.background};
//     color: ${({ theme }) => theme.colors.text};
//   }
// `;