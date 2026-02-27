'use client';

import { useEffect } from 'react';

interface Skill {
  id: number;
  name: string;
  icon_url: string;
  proficiency_level: number;
  order_index: number;
}

interface SkillModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SkillModal({ skill, isOpen, onClose }: SkillModalProps) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !skill) return null;

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

  // Get proficiency level text
  const getProficiencyText = (level: number): string => {
    if (level >= 80) return 'Advanced';
    if (level >= 60) return 'Intermediate';
    if (level >= 40) return 'Basic';
    return 'Beginner';
  };

  // Get proficiency color
  const getProficiencyColor = (level: number): string => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-blue-500';
    if (level >= 40) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const isImage = isImageUrl(skill.icon_url);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/30 animate-modal-appear"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
            <h2 className="text-3xl font-bold">{skill.name}</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close modal"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Icon */}
              <div className="flex items-center justify-center">
                {isImage ? (
                  <img
                    src={skill.icon_url}
                    alt={skill.name}
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <i
                    className={`${skill.icon_url} text-9xl ${getIconColor(skill.name)}`}
                  ></i>
                )}
              </div>

              {/* Skill Details */}
              <div className="md:col-span-2 space-y-6">
                {/* Proficiency Level */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">
                      My Skill Level
                    </span>
                    <span className="text-purple-500 font-bold">
                      {getProficiencyText(skill.proficiency_level)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full ${getProficiencyColor(skill.proficiency_level)} transition-all duration-500 rounded-full`}
                      style={{ width: `${skill.proficiency_level}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {skill.proficiency_level}%
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-purple-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    About This Skill
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {skill.name} is one of my core technical skills. I have extensive experience
                    working with this technology and continue to expand my knowledge through
                    practical projects and continuous learning.
                  </p>
                </div>

                {/* Projects/Usage (Placeholder) */}
                <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <i className="fas fa-project-diagram text-blue-500"></i>
                    Common Use Cases
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check-circle text-green-500 mt-1"></i>
                      <span>Building scalable applications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check-circle text-green-500 mt-1"></i>
                      <span>Solving complex technical challenges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check-circle text-green-500 mt-1"></i>
                      <span>Implementing best practices</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-appear {
          animation: modal-appear 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
