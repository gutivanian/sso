'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface App {
  id: string;
  name: string;
  description: string;
  url: string;
  callback_url: string;
  icon: string;
}

export default function AppsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [environment, setEnvironment] = useState<string>('development');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadApps();
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
        console.log('Loaded apps:', data.apps);
        console.log('Environment:', data.environment);
      }
    } catch (error) {
      console.error('Failed to load apps:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleAppClick = async (app: App) => {
    // Dapatkan token untuk dikirim ke aplikasi
    const response = await fetch('/api/auth/token');
    const data = await response.json();
    
    // Redirect ke aplikasi dengan token
    window.location.href = `${app.url}/auth/callback?token=${data.token}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Selamat Datang, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Pilih aplikasi yang ingin Anda akses
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Environment: <span className="font-semibold">{environment}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* App Grid */}
        {apps.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            <p className="text-xl mb-2">Tidak ada aplikasi yang terdaftar</p>
            <p className="text-sm">Silakan hubungi administrator</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:scale-105"
              >
                <div className="text-6xl mb-4">{app.icon}</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {app.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {app.description}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
