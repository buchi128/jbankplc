import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './project.css';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Counter from './context/Counter.jsx'


import App from './App';
import { BrowserRouter } from 'react-router-dom';
export const store = configureStore({
  reducer: { Counter }
})


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>

  </StrictMode>
);
