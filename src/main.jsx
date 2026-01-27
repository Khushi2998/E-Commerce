import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "sonner";
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './components/CartContext.jsx';
import { AuthProvider } from './components/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
  <AuthProvider>
    <Toaster position="top-right" richColors />
    <App />
    </AuthProvider>
    </CartProvider>
  </StrictMode>
)
