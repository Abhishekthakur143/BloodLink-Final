import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import './index.css';
import { loadUser } from './redux/slices/authSlice';
 
// App load hone pe agar token hai toh user restore karo
if (localStorage.getItem('token')) {
  store.dispatch(loadUser());
}
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);