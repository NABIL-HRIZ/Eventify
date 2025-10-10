import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from './store/Store.jsx';
import { AuthProvider } from "./auth/AuthContext";
import { Provider } from 'react-redux';

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
);

