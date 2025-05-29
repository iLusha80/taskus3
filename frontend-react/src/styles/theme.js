import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    background: '#F8F9FA', // Very light gray
    backgroundLight: '#E9ECEF', // Slightly darker light gray
    text: '#343A40', // Dark gray
    primary: '#0056B3', // A bit darker blue
    success: '#218838', // A bit darker green
    danger: '#C82333', // A bit darker red
    grayLight: '#DEE2E6', // Light gray
    grayMedium: '#ADB5BD', // Medium gray
    grayDark: '#495057', // Darker gray
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
    cardTitle: {
      fontSize: '1em',
      fontWeight: '600',
    },
    small: {
      fontSize: '0.9em',
      color: '#666666', // Using a specific gray for small text
    },
    xsmall: {
      fontSize: '0.85em',
      color: '#888888',
    },
  },
  spacing: {
    xsmall: '4px',
    small: '8px',
    medium: '16px',
    large: '32px',
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