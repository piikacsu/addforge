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
    description: 'A website for fun and gaming. Piikacsu\'s Games have a lot of fun and interesting games (the Operative Name is Piikacsu and the Access Key is Piikacsu)',
    url: 'https://www.friboard.com/',
    previewImage: '/friboard-preview.jpg?v=2',
    tags: ['GAMING', 'FUN', 'DARK UI'],
    categories: ['Games', 'Entertainment'],
    accentColor: '#00D4FF',
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
    description: 'Find Every McDonald\'s, Anywhere. Type in any country and city. Instantly discover every McDonald\'s nearby — with hours, directions, and reviews.',
    url: 'https://3ttsthjt5hpz2.kimi.page/#/',
    previewImage: '/kimi-page-preview.jpg?v=2',
    tags: ['FOOD', 'LOCATION', 'MODERN'],
    categories: ['Gaming', 'Utility'],
    accentColor: '#9D4EDD',
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
    description: 'AI-powered chat interface with dark blue gradient design. Login with your credentials or continue as guest to chat with the AI.',
    url: 'https://2wsdt5c6i44k2.ok.kimi.link/#/chat',
    previewImage: '/kimi-chat-preview.jpg?v=2',
    tags: ['AI', 'CHAT', 'DARK UI'],
    categories: ['AI', 'Productivity'],
    accentColor: '#FF006E',
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
    description: 'Custom manufacturing on demand. Upload your CAD file, get a quote, and have your parts made. Your CAD. Your part. Made.',
    url: 'https://www.abenerp.com',
    previewImage: '/abenerp-preview.jpg?v=2',
    tags: ['MANUFACTURING', 'CAD', 'ON-DEMAND'],
    categories: ['Business', 'Enterprise'],
    accentColor: '#E8913A',
    createdAt: '2024-04-05',
    stats: {
      loadTime: '1.1s',
      designScore: 8.8,
      features: ['Inventory', 'HR Module', 'Analytics', 'Cloud Sync'],
    },
  },
  {
    id: 'hskaozbhw4liw',
    name: 'Black Hole Explorer',
    description: 'Explore the mysteries of black holes. An interactive journey into the depths of space and the most fascinating phenomena in the universe.',
    url: 'https://hskaozbhw4liw.kimi.page/',
    previewImage: '/black-hole-explorer-preview.jpg?v=2',
    tags: ['SPACE', 'SCIENCE', 'INTERACTIVE'],
    categories: ['Science', 'Education'],
    accentColor: '#7B2D8E',
    createdAt: '2024-06-15',
    stats: {
      loadTime: '0.7s',
      designScore: 9.5,
      features: ['3D Visualization', 'Interactive', 'Educational', 'Real-time'],
    },
  },
  {
    id: 'emoji-kitchen',
    name: 'Emoji Kitchen Mixer',
    description: 'Discover thousands of emoji combinations. Mix, create, and share your favorite blends with the Emoji Alchemy Studio.',
    url: 'https://rsjpzuosqcnda.kimi.page/',
    previewImage: '/emoji-kitchen-preview.jpg?v=2',
    tags: ['EMOJI', 'CREATIVE', 'FUN'],
    categories: ['Entertainment', 'Creative'],
    accentColor: '#FFB800',
    createdAt: '2024-05-01',
    stats: {
      loadTime: '0.9s',
      designScore: 9.0,
      features: ['Random Mix', 'Emoji Picker', 'Share', 'Responsive'],
    },
  },
  {
    id: 'flappy-3d',
    name: 'Flappy 3D',
    description: 'A cinematic 3D bird adventure game. Soar through golden skies, navigate floating islands, and experience the classic flappy gameplay reimagined in stunning low-poly 3D.',
    url: 'https://g4oyoxsqnxkgu.kimi.page',
    previewImage: '/flappy-3d-preview.jpg?v=2',
    tags: ['GAMING', '3D', 'CINEMATIC'],
    categories: ['Games', 'Entertainment'],
    accentColor: '#00D9FF',
    createdAt: '2024-07-01',
    stats: {
      loadTime: '1.0s',
      designScore: 9.1,
      features: ['3D Graphics', 'Responsive', 'Arcade Mode', 'Score System'],
    },
  },
  {
    id: 'olympus',
    name: 'OLYMPUS',
    description: 'Journey into Greek mythology. Explore the pantheon of gods, epic legends, and ancient wonders through a dramatic, cinematic web experience.',
    url: 'https://2bsl6b7j2g6ae.kimi.page/',
    previewImage: '/olympus-preview.jpg?v=2',
    tags: ['MYTHOLOGY', 'EPIC', 'CINEMATIC'],
    categories: ['Education', 'Entertainment'],
    accentColor: '#C9A84C',
    createdAt: '2024-07-10',
    stats: {
      loadTime: '1.3s',
      designScore: 9.4,
      features: ['Interactive', 'Storytelling', 'Visual Rich', 'Educational'],
    },
  },
  {
    id: 'nightlines',
    name: 'NIGHTLINES',
    description: 'An atlas of the last great night trains. Discover sleeper routes, berths, timetables and field notes from the night railway — a cinematic journey after dark.',
    url: 'https://nhga73bsn5cc4.kimi.page/',
    previewImage: '/nightlines-preview.jpg?v=2',
    tags: ['TRAVEL', 'NIGHT', 'ATLAS'],
    categories: ['Travel', 'Lifestyle'],
    accentColor: '#6366F1',
    createdAt: "2024-07-16",
    stats: {
      loadTime: '1.1s',
      designScore: 9.3,
      features: ['Route Map', 'Timetables', 'Field Notes', 'Photography'],
    },
  },
];
