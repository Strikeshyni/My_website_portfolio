import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Project } from '../types';
import { apiUrl } from '../lib/api';
import { projects_fallback } from '../data/projects_fallback.ts';

export const ProjectContext = createContext<{
  projects: Project[];
  loading: boolean;
  healthStatus: Record<string, boolean>;
  checkAllHealth: (projectList: Project[]) => Promise<void>;
} | null>(null);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<Record<string, boolean>>({});

  /**
   * Performs health checks on a list of projects.
   * Defined with useCallback(..., []) to maintain a stable function reference
   * that won't trigger re-renders or effect loops.
   */
  const checkAllHealth = useCallback(async (projectList: Project[]) => {
    if (!projectList || projectList.length === 0) return;

    const status: Record<string, boolean> = {};
    const checks = projectList.map(async (project) => {
      if (!project.healthCheckUrl) return null;
      try {
        const is_http = project.healthCheckUrl.startsWith('http');
        const healthUrl = is_http
          ? project.healthCheckUrl
          : apiUrl(project.healthCheckUrl);

        const response = await axios.get(healthUrl, { timeout: 10000 });
        
        // Safety check: If the response is HTML, it might be a redirect to a 404 page
        // instead of a real API response (common on some hosting providers).
        const isHtml = typeof response.data === 'string' && (response.data.trim().startsWith('<!doctype html>') && !is_http);

        return { id: project._id, isHealthy: !isHtml };
      } catch (error) {
        return { id: project._id, isHealthy: false };
      }
    });

    const results = await Promise.all(checks);
    results.forEach((result) => {
      if (result) status[result.id] = result.isHealthy;
    });

    setHealthStatus((prev) => ({ ...prev, ...status }));
  }, []);

  /**
   * Main initialization effect. 
   * Fetches projects from the backend and immediately triggers health checks.
   */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get(apiUrl('/api/projects'), { timeout: 8000 });
        const rawProjects = res.data;
        const fetchedProjects = Array.isArray(rawProjects)
          ? rawProjects
          : (rawProjects?.projects || rawProjects?.data || []);

        if (!Array.isArray(fetchedProjects)) {
          throw new Error('Projects API did not return an array');
        }

        setProjects(fetchedProjects);

        // Trigger health checks for live data
        checkAllHealth(fetchedProjects);
      } catch (err) {
        console.error('Failed to fetch projects, using fallback data:', err);
        const fallback: Project[] = projects_fallback; // Import or define your fallback data
        setProjects(fallback);
        
        // Trigger health checks for fallback data
        checkAllHealth(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [checkAllHealth]);

  return (
    <ProjectContext.Provider value={{ projects, loading, healthStatus, checkAllHealth }}>
      {children}
    </ProjectContext.Provider>
  );
};