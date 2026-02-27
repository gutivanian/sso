'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface App {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
}

interface MyAppsSectionProps {
  isLoggedIn: boolean;
}

export default function MyAppsSection({ isLoggedIn }: MyAppsSectionProps) {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const response = await fetch('/api/apps');
      if (response.ok) {
        const data = await response.json();
        setApps(data.apps || []);
      }
    } catch (error) {
      console.error('Failed to load apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppClick = async (app: App) => {
    // Jika belum login, redirect ke login
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    // Jika sudah login, lanjutkan ke app
    const response = await fetch('/api/auth/token');
    const data = await response.json();
    window.location.href = `${app.url}/auth/callback?token=${data.token}`;
  };

  if (loading) {
    return (
      <section id="apps" className="py-20 px-4 bg-white dark:bg-black">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            My <span className="text-purple-500">Applications</span>
          </h2>
          <div className="text-center text-gray-400">
            <i className="fas fa-spinner fa-spin text-2xl"></i>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="apps" className="py-20 px-4 bg-white dark:bg-black">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-4">
          My <span className="text-purple-500">Applications</span>
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Access your registered applications
        </p>

        {apps.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-gray-100 dark:bg-gray-900/50 rounded-lg border border-purple-500/30">
            <i className="fas fa-inbox text-5xl mb-4 block text-gray-400 dark:text-gray-600"></i>
            <p className="text-xl mb-2 text-gray-700 dark:text-gray-400">No applications registered yet</p>
            <p className="text-sm text-gray-600 dark:text-gray-500">Contact administrator to register apps</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                className="group bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg p-8 hover:shadow-2xl hover:shadow-purple-500/20 transition-all hover:scale-105 border border-purple-500/30 hover:border-purple-500 text-left"
              >
                <div className="text-6xl mb-4 grayscale group-hover:grayscale-0 transition-all">
                  {app.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {app.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {app.description}
                </p>
                <div className="text-purple-500 flex items-center gap-2 group-hover:gap-3 transition-all">
                  Launch app <i className="fas fa-arrow-right"></i>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
