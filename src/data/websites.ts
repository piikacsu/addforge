export interface Website {
  id: string;
  name: string;
  description: string;
  url: string;
  previewImage: string;
  tags: string[];
  categories: string[];
  accentColor: string;
}

export const websites: Website[] = [
  {
    id: 'neon-shop',
    name: 'Neon Shop',
    description: 'A futuristic e-commerce storefront with glowing product cards and real-time inventory.',
    url: 'https://neon-shop.example.com',
    previewImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop',
    tags: ['e-commerce', 'futuristic', 'neon'],
    categories: ['Retail', 'Technology'],
    accentColor: '#00D4FF',
  },
  {
    id: 'aura-saas',
    name: 'Aura SaaS',
    description: 'Minimalist SaaS landing page with gradient hero and feature grid.',
    url: 'https://aura-saas.example.com',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    tags: ['saas', 'minimal', 'gradient'],
    categories: ['Business', 'Software'],
    accentColor: '#9D4EDD',
  },
  {
    id: 'pulse-blog',
    name: 'Pulse Blog',
    description: 'Modern editorial platform with typography-focused design and reading modes.',
    url: 'https://pulse-blog.example.com',
    previewImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    tags: ['blog', 'editorial', 'minimal'],
    categories: ['Publishing', 'Media'],
    accentColor: '#FF006E',
  },
  {
    id: 'zenith-portfolio',
    name: 'Zenith Portfolio',
    description: 'Creative portfolio with scroll-driven animations and project showcases.',
    url: 'https://zenith-portfolio.example.com',
    previewImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
    tags: ['portfolio', 'creative', 'animation'],
    categories: ['Creative', 'Design'],
    accentColor: '#E8913A',
  },
];
