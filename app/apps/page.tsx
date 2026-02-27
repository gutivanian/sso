'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface App {
  id: string;
  name: string;
  description: string;
  url: string;
  callback_url: string;
  icon: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  program: string;
  image_url: string;
  demo_url?: string;
  source_url?: string;
}

export default function AppsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [environment, setEnvironment] = useState<string>('development');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadApps();
    loadProjects();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadApps = async () => {
    try {
      const response = await fetch('/api/apps');
      if (response.ok) {
        const data = await response.json();
        setApps(data.apps);
        setEnvironment(data.environment);
      }
    } catch (error) {
      console.error('Failed to load apps:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/portfolio/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleAppClick = async (app: App) => {
    const response = await fetch('/api/auth/token');
    const data = await response.json();
    window.location.href = `${app.url}/auth/callback?token=${data.token}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-xl text-purple-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-purple-500/30 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-500">
            Gutivan&apos;s Portal
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Welcome, <span className="text-purple-400">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* My Apps Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              My <span className="text-purple-500">Applications</span>
            </h1>
            <p className="text-gray-400">Access your registered applications</p>
            <p className="text-xs text-gray-600 mt-1">
              Environment: <span className="font-semibold text-purple-500">{environment}</span>
            </p>
          </div>

          {apps.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-gray-900/50 rounded-lg border border-purple-500/30">
              <p className="text-xl mb-2">No applications registered</p>
              <p className="text-sm">Contact administrator to register apps</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app)}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-8 hover:shadow-2xl hover:shadow-purple-500/20 transition-all hover:scale-105 border border-purple-500/30 hover:border-purple-500 text-left"
                >
                  <div className="text-6xl mb-4">{app.icon}</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {app.name}
                  </h2>
                  <p className="text-gray-400">
                    {app.description}
                  </p>
                  <div className="mt-4 text-purple-400 flex items-center gap-2">
                    Launch app <i className="fas fa-arrow-right"></i>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Portfolio Section */}
        <section className="py-12 border-t border-purple-500/30">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">
              My <span className="text-purple-500">Portfolio</span>
            </h2>
            <p className="text-gray-400">Check out my recent projects and work</p>
          </div>

          {projects.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No projects found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-900 rounded-lg overflow-hidden border border-purple-500/30 hover:border-purple-500 transition-all hover:scale-105"
                >
                  {project.image_url && (
                    <div className="h-48 bg-gray-800 overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-purple-400">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">{project.program}</p>
                    </div>
                    <div className="flex gap-3">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm px-3 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition"
                        >
                          <i className="fas fa-external-link-alt mr-1"></i> Demo
                        </a>
                      )}
                      {project.source_url && (
                        <a
                          href={project.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm px-3 py-1 bg-gray-700/50 text-gray-300 rounded hover:bg-gray-700 transition"
                        >
                          <i className="fab fa-github mr-1"></i> Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

