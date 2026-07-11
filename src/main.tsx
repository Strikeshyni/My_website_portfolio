import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.tsx'
import './index.css'
import "./i18n";
import { API_BASE_URL } from './lib/api'
import { ProjectProvider } from './context/ProjectContext';
import { ThemeProvider } from './context/ThemeContext';

if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <ThemeProvider>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </ThemeProvider>
  // </React.StrictMode>,
)
