export interface Website {
  id: string;
  name: string;
  description: string;
  url: string;
  previewImage: string;
  tags: string[];
  categories: string[];
  accentColor: string;
  createdAt?: string;
  stats?: {
    loadTime: string;
    designScore: number;
    features: string[];
  };
}

export const websites: Website[] = [
  {
    id: 'piikacsu-games',
    name: "Piikacsu's Games",
    description: 'A collection of fun browser-based games including puzzles, arcade classics, and original creations.',
    url: 'https://games.piikacsu.com',
    previewImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
    tags: ['games', 'entertainment', 'browser', 'interactive'],
    categories: ['Games', 'Entertainment'],
    accentColor: '#FF006E',
    createdAt: '2024-01-15',
    stats: {
      loadTime: '1.2s',
      designScore: 8.5,
      features: ['Multiplayer', 'Leaderboards', 'Achievements', 'Responsive'],
    },
  },
  {
    id: 'mc-locate',
    name: 'Mc Locate',
    description: 'Real-time location tracking and mapping service for Minecraft servers. Find players, bases, and points of interest.',
    url: 'https://mclocate.app',
    previewImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop',
    tags: ['minecraft', 'mapping', 'tracking', 'gaming'],
    categories: ['Gaming', 'Utility'],
    accentColor: '#00D4FF',
    createdAt: '2024-02-20',
    stats: {
      loadTime: '0.8s',
      designScore: 9.0,
      features: ['Real-time', '3D Map', 'Server Sync', 'Mobile App'],
    },
  },
  {
    id: 'piikacsu-ai',
    name: 'Piikacsu AI',
    description: 'AI-powered creative tools for image generation, text analysis, and content creation. Powered by latest ML models.',
    url: 'https://ai.piikacsu.com',
    previewImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    tags: ['ai', 'machine-learning', 'creative', 'productivity'],
    categories: ['AI', 'Productivity'],
    accentColor: '#9D4EDD',
    createdAt: '2024-03-10',
    stats: {
      loadTime: '1.5s',
      designScore: 9.2,
      features: ['Image Gen', 'Text Analysis', 'API Access', 'Custom Models'],
    },
  },
  {
    id: 'abenerp',
    name: 'ABENERP',
    description: 'Enterprise resource planning solution for small to medium businesses. Streamline operations, inventory, and HR.',
    url: 'https://abenerp.com',
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    tags: ['erp', 'business', 'management', 'enterprise'],
    categories: ['Business', 'Enterprise'],
    accentColor: '#E8913A',
    createdAt: '2024-04-05',
    stats: {
      loadTime: '1.1s',
      designScore: 8.8,
      features: ['Inventory', 'HR Module', 'Analytics', 'Cloud Sync'],
    },
  },
];
