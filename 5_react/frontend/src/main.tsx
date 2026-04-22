import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ApiClient } from './apiClient.ts'
import { BrowserRouter } from 'react-router';

const api = new ApiClient({ "baseUrl": "http://localhost:8080/" });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App api={api} />
    </BrowserRouter>
  </StrictMode>,
);
