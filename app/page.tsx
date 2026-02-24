import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sso_token');

  // Jika sudah login dan tidak ada redirect_uri, tampilkan app list
  if (token) {
    redirect('/apps');
  }

  // Jika belum login, redirect ke login
  redirect('/login');
}
