import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gutivan Alief Syahputra - Portfolio & SSO',
  description: 'Portfolio and Single Sign-On for multiple applications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get theme from localStorage, default to 'dark'
                  var theme = localStorage.getItem('theme') || 'dark';
                  var html = document.documentElement;
                  
                  // Force remove/add class based on theme
                  // This overrides any system preference
                  if (theme === 'dark') {
                    html.classList.add('dark');
                  } else {
                    html.classList.remove('dark');
                  }
                  
                  // Set on both html and body to ensure coverage
                  html.style.colorScheme = theme;
                } catch (e) {
                  // Fallback to dark if error
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
