import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from "sonner";
import { router } from './Routers/routes.tsx'
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import './global.css'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </>
    </Provider>
  </StrictMode>,
);
