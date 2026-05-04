import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SaveContact from './pages/SaveContact';
import Admin from './pages/Admin';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/save" element={<SaveContact />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </BrowserRouter>
);
