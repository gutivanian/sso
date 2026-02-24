import { NextRequest, NextResponse } from 'next/server';
import { getRegisteredApps, getEnvironment } from '@/lib/db';

/**
 * GET /api/apps
 * Get list of registered apps dengan URL sesuai environment (dev/prod)
 */
export async function GET(request: NextRequest) {
  try {
    const apps = await getRegisteredApps();
    const env = getEnvironment();
    
    console.log(`[GET /api/apps] Environment: ${env}`);
    console.log(`[GET /api/apps] Found ${apps.length} apps`);

    // Transform data untuk client
    const appList = apps.map(app => {
      const appUrl = env === 'production' 
        ? (app.prod_app_url || app.dev_app_url) 
        : app.dev_app_url;
        
      const callbackUrl = env === 'production'
        ? (app.prod_callback_url || app.dev_callback_url)
        : app.dev_callback_url;

      return {
        id: app.id,
        name: app.name,
        description: app.description,
        url: appUrl,
        callback_url: callbackUrl,
        icon: getAppIcon(app.id), // Helper untuk icon
      };
    });

    return NextResponse.json({
      apps: appList,
      environment: env,
    });
  } catch (error) {
    console.error('[GET /api/apps] Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch apps' },
      { status: 500 }
    );
  }
}

/**
 * Helper untuk mendapatkan icon app
 */
function getAppIcon(appId: string): string {
  const icons: Record<string, string> = {
    'blog-belajar': '📚',
    'pftu': '💰',
  };
  return icons[appId] || '🔷';
}
