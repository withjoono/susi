import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import './satoshi.css';
import { ThemeProvider } from '@material-tailwind/react';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Router>,
);
