import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: ${({ theme }) => theme.typography.body.lineHeight};
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.text};
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    font-weight: ${({ theme }) => theme.typography.heading3.fontWeight}; // Default heading weight
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.heading1.fontSize};
    font-weight: ${({ theme }) => theme.typography.heading1.fontWeight};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.heading2.fontSize};
    font-weight: ${({ theme }) => theme.typography.heading2.fontWeight};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.heading3.fontSize};
    font-weight: ${({ theme }) => theme.typography.heading3.fontWeight};
  }

  p {
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    cursor: pointer;
  }
`;