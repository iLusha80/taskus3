import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import './index.css'; // Keep existing global styles for now, will refactor later

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ThemeProvider>
  </StrictMode>,
);
