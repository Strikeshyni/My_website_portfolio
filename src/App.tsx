import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import ProjectDemo from './pages/projects/ProjectDemo';

const LegacyProjectRedirect = () => {
  const { slug } = useParams();
  const target = slug ? `/projects/${slug}` : '/';
  return <Navigate to={target} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/projects/:slug/demo" element={<ProjectDemo />} />

        <Route path="/project/:slug" element={<LegacyProjectRedirect />} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;
