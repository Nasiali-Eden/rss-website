import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/tokens.css';
import './styles/global.css';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
// Pages are prerendered at build time, so hydrate when HTML is already there.
// (In dev the root only holds the <!--app--> placeholder comment, so check for an element.)
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
