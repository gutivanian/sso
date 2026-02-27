import Link from 'next/link';
import { cookies } from 'next/headers';
import SkillsSection from './components/SkillsSection';
import Header from './components/Header';
import MyAppsSection from './components/MyAppsSection';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sso_token');
  const isLoggedIn = !!token;

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors">
      {/* Sticky Header */}
      <Header isLoggedIn={isLoggedIn} />
      
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 py-20 pt-32">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="welcome">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Nice To Meet You!{' '}
                  <span className="inline-block animate-wave">👋🏻</span>
                </h1>
                <h1 className="text-3xl md:text-4xl font-bold">
                  I&apos;M{' '}
                  <strong className="text-purple-500">GUTIVAN ALIEF SYAHPUTRA</strong>
                </h1>
              </div>

              <div className="typewriter text-xl md:text-2xl font-mono text-purple-400">
                <span>Data Engineer</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                I&apos;m Gutivan Alief Syahputra, a theoretical physics ⚛️ master&apos;s graduate from ITS Surabaya, 
                passionate about merging scientific knowledge with cutting-edge technology 💻 to solve real-world 
                problems and enhance quality of life 🌍.
              </p>

              {/* Social Links */}
              <div className="pt-8">
                <h2 className="text-xl font-bold mb-4">FIND ME ON</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Feel free to <span className="text-purple-500">connect</span> with me
                </p>
                <div className="flex gap-4">
                  <a
                    href="http://github.com/gutivanian"
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-purple-500 hover:bg-purple-500 text-gray-900 dark:text-white hover:text-white transition-colors"
                  >
                    <i className="fab fa-github text-xl"></i>
                  </a>
                  <a
                    href="https://facebook.com/starefondofne"
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-purple-500 hover:bg-purple-500 text-gray-900 dark:text-white hover:text-white transition-colors"
                  >
                    <i className="fab fa-facebook-f text-xl"></i>
                  </a>
                  <a
                    href="http://x.com/gutivanian"
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-purple-500 hover:bg-purple-500 text-gray-900 dark:text-white hover:text-white transition-colors"
                  >
                    <i className="fab fa-twitter text-xl"></i>
                  </a>
                  <a
                    href="https://id.linkedin.com/in/gutivan-alief-syahputra-47b69318b"
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-purple-500 hover:bg-purple-500 text-gray-900 dark:text-white hover:text-white transition-colors"
                  >
                    <i className="fab fa-linkedin text-xl"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/gutivanian/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-purple-500 hover:bg-purple-500 text-gray-900 dark:text-white hover:text-white transition-colors"
                  >
                    <i className="fab fa-instagram text-xl"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Image/Placeholder */}
            <div className="hidden md:block">
              <div className="w-full h-96 bg-gradient-to-br from-purple-200/50 to-blue-200/50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-500/30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Let Me <span className="text-purple-500">Introduce Myself</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              <p className="text-xl">
                Hi Everyone, I am <span className="text-blue-400">Gutivan Alief Syahputra</span> from{' '}
                <span className="text-blue-400">Surabaya, Indonesia.</span>
              </p>
              
              <p>
                I am a master&apos;s graduate in theoretical physics from Institut Teknologi Sepuluh Nopember Surabaya, 
                with a keen interest in the IT world, aiming to solve real-world problems related to science, 
                quality of life, education, and hobbies.
              </p>
              
              <p>
                My passion lies in integrating my physics background with cutting-edge technology to create impactful solutions. 
                Whether it&apos;s harnessing advanced programming languages, utilizing state-of-the-art frameworks, or applying 
                technological advancements in novel ways, I&apos;m always eager to tackle new challenges.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-purple-500">More About Me</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Transforming hobbies and interests into meaningful projects is a source of great satisfaction for me. 
                It allows me to blend creativity with technical skills, whether I&apos;m developing educational tools, 
                enhancing quality of life through technology, or exploring scientific applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Skillset Section */}
      <SkillsSection />

      {/* My Apps Section - Always show, but redirect to login if not logged in */}
      <MyAppsSection isLoggedIn={isLoggedIn} />

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 bg-white dark:bg-black">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            <strong className="text-purple-500">Projects</strong>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sample featured projects - will be dynamic later */}
            {/* Sample featured projects - will be dynamic later */}
            {[
              {
                title: 'Shopify',
                description: 'An e-commerce platform that allows anyone to set up an online store and sell their products.',
                image: 'https://images.ctfassets.net/lh3zuq09vnm2/6FdHOZHJKvrlc1dAWXdqlu/2e83c3b20cb1af6f42d99b4b8439d5eb/05_Shopify.jpg',
              },
              {
                title: 'Weather App',
                description: 'A web application that provides weather forecasts for different locations.',
                image: 'https://images.ctfassets.net/lh3zuq09vnm2/6v6hASKYhu8sohkJgIUIMW/bd0f0f28e9313f8945fd50474513c08a/03_Freshbooks.jpg',
              },
              {
                title: 'Portfolio Website',
                description: 'A personal portfolio website to showcase projects and skills.',
                image: 'https://www.wordstream.com/wp-content/uploads/2022/07/nonprofit-website-examples-iwmf.png',
              },
            ].map((project, idx) => (
              <div
                key={idx}
                className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-purple-500/30 hover:border-purple-500 transition-colors"
              >
                <div className="h-48 bg-gray-300 dark:bg-gray-800 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-purple-500">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
