import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { initAnalytics } from './lib/analytics';
import { kaynagiYakala, girisSayfasiniYakala } from './lib/kaynak';
import './index.css';

initAnalytics();

// Ziyaretçinin nereden ve hangi sayfadan geldiğini ilk açılışta yakala.
// Kayıt formuna geldiğinde adres çubuğunda kampanya parametresi kalmamış olsa
// bile ilk temas noktasını biliyoruz.
kaynagiYakala();
girisSayfasiniYakala();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
