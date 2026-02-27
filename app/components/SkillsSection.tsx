'use client';

import { useState, useEffect } from 'react';
import SkillModal from './SkillModal';

interface Skill {
  id: number;
  name: string;
  icon_url: string;
  proficiency_level: number;
  order_index: number;
}

interface SkillCategory {
  id: number;
  name: string;
  slug: string;
  skills: Skill[];
}

interface SkillsData {
  [key: string]: SkillCategory;
}

interface CategoryTab {
  slug: string;
  name: string;
}

// Helper function to detect if icon is an image URL or Font Awesome class
const isImageUrl = (iconUrl: string): boolean => {
  return iconUrl.startsWith('/') || iconUrl.startsWith('http');
};

// Helper to get icon color based on skill name (untuk Font Awesome)
const getIconColor = (name: string): string => {
  const colorMap: { [key: string]: string } = {
    'Python': 'text-blue-400',
    'JavaScript': 'text-yellow-400',
    'MATLAB': 'text-orange-500',
    'R': 'text-blue-500',
    'SQL': 'text-orange-400',
    'Dart': 'text-blue-400',
    'Mathematica': 'text-red-500',
    'VS Code': 'text-blue-500',
    'CMD': 'text-gray-400',
    'Git': 'text-orange-500',
    'GitHub': 'text-gray-900 dark:text-white',
    'PyCharm': 'text-green-400',
    'Docker': 'text-blue-400',
    'HTML5': 'text-orange-500',
    'CSS3': 'text-blue-500',
    'Bootstrap': 'text-purple-500',
    'Tailwind CSS': 'text-cyan-400',
    'React': 'text-cyan-400',
    'Node.js': 'text-green-500',
    'MongoDB': 'text-green-500',
    'PostgreSQL': 'text-blue-400',
    'Redis': 'text-red-500',
    'Express': 'text-gray-600',
    'Excel': 'text-green-500',
    'Power BI': 'text-yellow-500',
    'Tableau': 'text-blue-600',
  };
  return colorMap[name] || 'text-purple-400';
};

export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState<string>('prolang');
  const [skillsData, setSkillsData] = useState<SkillsData>({});
  const [categories, setCategories] = useState<CategoryTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSkill(null);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/portfolio/skills');
      if (response.ok) {
        const result = await response.json();
        setSkillsData(result.data);
        setCategories(result.categories.map((cat: any) => ({
          slug: cat.slug,
          name: cat.name
        })));
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="skills" className="py-20 px-4 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            Professional <span className="text-purple-500">Skillset</span>
          </h2>
          <div className="text-center text-gray-400">
            <i className="fas fa-spinner fa-spin text-2xl"></i>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 px-4 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-4">
          Professional <span className="text-purple-500">Skillset</span>
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Technologies and tools I work with
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setActiveTab(tab.slug)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.slug
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skillsData[activeTab]?.skills?.map((skill) => {
            const isImage = isImageUrl(skill.icon_url);
            
            return (
              <div
                key={skill.id}
                onClick={() => handleSkillClick(skill)}
                className="group bg-white dark:bg-gray-900 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                <div className="flex flex-col items-center gap-3">
                  {/* Icon - bisa Font Awesome atau Gambar */}
                  {isImage ? (
                    <img
                      src={skill.icon_url}
                      alt={skill.name}
                      className="w-16 h-16 object-contain grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300"
                    />
                  ) : (
                    <i 
                      className={`${skill.icon_url} text-5xl ${getIconColor(skill.name)} grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300`}
                    ></i>
                  )}
                  <span className="text-gray-900 dark:text-white font-medium text-center">
                    {skill.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Modal */}
      <SkillModal
        skill={selectedSkill}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
