import { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Download, Code, Copy, Check, QrCode, ExternalLink, Palette, Monitor, Sparkles, GlassWater, Gamepad2, Leaf } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { useToast } from '../context/ToastContext';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon-soaked dystopian aesthetic with sharp contrasts',
    icon: <Gamepad2 size={24} />,
    gradient: 'linear-gradient(135deg, #FF006E 0%, #9D4EDD 50%, #00D4FF 100%)',
    borderColor: 'rgba(0,212,255,0.3)',
    textColor: '#00D4FF',
    accentColor: '#00D4FF',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, understated elegance with generous whitespace',
    icon: <Monitor size={24} />,
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderColor: 'rgba(255,255,255,0.15)',
    textColor: '#ffffff',
    accentColor: '#ffffff',
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Bright, glowing accents on deep dark backgrounds',
    icon: <Sparkles size={24} />,
    gradient: 'linear-gradient(135deg, #0A0A12 0%, #1a0a2e 50%, #0a1a2e 100%)',
    borderColor: 'rgba(255,0,110,0.3)',
    textColor: '#FF006E',
    accentColor: '#FF006E',
  },
  {
    id: 'glassmorphic',
    name: 'Glassmorphic',
    description: 'Frosted glass panels with subtle transparency',
    icon: <GlassWater size={24} />,
    gradient: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
    borderColor: 'rgba(255,255,255,0.2)',
    textColor: '#ffffff',
    accentColor: '#9D4EDD',
  },
  {
    id: 'retro',
    name: 'Retro',
    description: 'Warm vintage tones with a nostalgic feel',
    icon: <Palette size={24} />,
    gradient: 'linear-gradient(135deg, #E8913A 0%, #8B4513 50%, #D2691E 100%)',
    borderColor: 'rgba(232,145,58,0.3)',
    textColor: '#E8913A',
    accentColor: '#E8913A',
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Organic greens and earth tones for a calming vibe',
    icon: <Leaf size={24} />,
    gradient: 'linear-gradient(135deg, #00FF88 0%, #00A86B 50%, #0A0A12 100%)',
    borderColor: 'rgba(0,255,136,0.3)',
    textColor: '#00FF88',
    accentColor: '#00FF88',
  },
];

const DEFAULT_TEMPLATE = TEMPLATES[0];

export default function Create() {
  const { success } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(DEFAULT_TEMPLATE);
  const [showTemplateGallery, setShowTemplateGallery] = useState(true);
  const [adName, setAdName] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adUrl, setAdUrl] = useState('');
  const [adTags, setAdTags] = useState('');
  const [previewMode, setPreviewMode] = useState<'preview' | 'qr' | 'embed'>('preview');
  const [embedCopied, setEmbedCopied] = useState(false);
  const previewCardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const tagsList = adTags.split(',').map(t => t.trim()).filter(Boolean);

  const handleDownloadPNG = useCallback(async () => {
    if (!previewCardRef.current) return;
    setIsCapturing(true);
    try {
      await new Promise(r => setTimeout(r, 100));
      const canvas = await html2canvas(previewCardRef.current, {
        backgroundColor: '#0A0A12',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${adName || 'adforge-ad'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      success('Ad downloaded as PNG!');
    } catch (err) {
      console.error('Capture failed:', err);
    } finally {
      setIsCapturing(false);
    }
  }, [adName, success]);

  const embedCode = useMemo(() => {
    const escapedName = adName || 'Your Ad';
    const escapedDesc = adDescription || 'Description here';
    return `<iframe
  src="${adUrl || 'https://example.com'}"
  title="${escapedName}"
  width="300"
  height="200"
  style="border: none; border-radius: 16px; overflow: hidden;"
  loading="lazy"
></iframe>

<!-- Or embed as a card link -->
<a href="${adUrl || 'https://example.com'}" target="_blank" rel="noopener noreferrer"
   style="display: inline-block; text-decoration: none; font-family: sans-serif; max-width: 300px;">
  <div style="border-radius: 16px; padding: 20px; background: ${selectedTemplate.gradient}; border: ${selectedTemplate.borderColor} 1px solid; color: #fff;">
    <h3 style="margin: 0 0 8px; font-size: 16px; color: ${selectedTemplate.textColor};">${escapedName}</h3>
    <p style="margin: 0; font-size: 13px; opacity: 0.8;">${escapedDesc}</p>
  </div>
</a>`;
  }, [adName, adDescription, adUrl, selectedTemplate]);

  const handleCopyEmbed = useCallback(() => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setEmbedCopied(true);
      success('Embed code copied!');
      setTimeout(() => setEmbedCopied(false), 2000);
    });
  }, [embedCode, success]);

  const previewImage = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop';

  return (
    <div className="min-h-screen" style={{ background: '#0A0A12', fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.15) 0%, transparent 60%)' }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Wand2 size={32} style={{ color: '#00D4FF' }} />
              <h1
                className="text-4xl sm:text-5xl font-bold"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  background: 'linear-gradient(135deg, #00D4FF 0%, #9D4EDD 50%, #FF006E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Create Ad
              </h1>
            </div>
            <p className="text-base sm:text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Design, preview, and export your website ad
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Template Gallery */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
              Choose Template
            </h2>
            <button
              onClick={() => setShowTemplateGallery(!showTemplateGallery)}
              className="text-xs transition-opacity hover:opacity-70"
              style={{ color: '#00D4FF' }}
            >
              {showTemplateGallery ? 'Collapse' : 'Expand'}
            </button>
          </div>
          <AnimatePresence>
            {showTemplateGallery && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {TEMPLATES.map((template) => (
                    <motion.button
                      key={template.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedTemplate(template)}
                      className="relative rounded-2xl p-4 text-left transition-all duration-200"
                      style={{
                        background: template.gradient,
                        border: `2px solid ${selectedTemplate.id === template.id ? template.accentColor : 'transparent'}`,
                        boxShadow: selectedTemplate.id === template.id ? `0 0 20px ${template.accentColor}33` : 'none',
                      }}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-3" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                        {template.icon}
                      </div>
                      <div className="text-sm font-bold mb-1" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {template.name}
                      </div>
                      <div className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {template.description}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h3 className="text-sm font-bold mb-5" style={{ color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
              Ad Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Website Name
                </label>
                <input
                  type="text"
                  value={adName}
                  onChange={e => setAdName(e.target.value)}
                  placeholder="e.g., My Awesome App"
                  className="w-full h-10 px-4 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Description
                </label>
                <textarea
                  value={adDescription}
                  onChange={e => setAdDescription(e.target.value)}
                  placeholder="Brief description of your website..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Website URL
                </label>
                <input
                  type="url"
                  value={adUrl}
                  onChange={e => setAdUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full h-10 px-4 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={adTags}
                  onChange={e => setAdTags(e.target.value)}
                  placeholder="saas, ai, productivity"
                  className="w-full h-10 px-4 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-4">
              {[
                { key: 'preview' as const, label: 'Preview', icon: <Monitor size={14} /> },
                { key: 'qr' as const, label: 'QR Code', icon: <QrCode size={14} /> },
                { key: 'embed' as const, label: 'Embed', icon: <Code size={14} /> },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setPreviewMode(tab.key)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                  style={{
                    background: previewMode === tab.key ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.05)',
                    color: previewMode === tab.key ? '#00D4FF' : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${previewMode === tab.key ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {previewMode === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Preview Card */}
                  <div
                    ref={previewCardRef}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: selectedTemplate.gradient,
                      border: `1px solid ${selectedTemplate.borderColor}`,
                    }}
                  >
                    {/* Image area */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        style={{ opacity: 0.7 }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(10,10,18,0.95) 0%, transparent 60%)' }}
                      />
                      {/* Template badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase"
                          style={{
                            background: `${selectedTemplate.accentColor}22`,
                            color: selectedTemplate.accentColor,
                            border: `1px solid ${selectedTemplate.accentColor}44`,
                          }}
                        >
                          {selectedTemplate.name}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ fontFamily: 'Space Grotesk, sans-serif', color: selectedTemplate.textColor }}
                      >
                        {adName || 'Your Website Name'}
                      </h3>
                      <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {adDescription || 'Your website description will appear here...'}
                      </p>
                      {tagsList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {tagsList.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <a
                          href={adUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-80"
                          style={{ color: selectedTemplate.accentColor }}
                        >
                          <span>{adUrl ? new URL(adUrl.startsWith('http') ? adUrl : `https://${adUrl}`).hostname.replace('www.', '') : 'example.com'}</span>
                          <ExternalLink size={12} />
                        </a>
                        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          Powered by AdForge
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownloadPNG}
                      disabled={isCapturing}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #00D4FF, #9D4EDD)',
                        color: '#0A0A12',
                      }}
                    >
                      <Download size={16} />
                      {isCapturing ? 'Capturing...' : 'Download PNG'}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {previewMode === 'qr' && (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className="rounded-2xl p-8 flex flex-col items-center"
                    style={{
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {adUrl ? (
                      <QRCodeSVG
                        value={adUrl.startsWith('http') ? adUrl : `https://${adUrl}`}
                        size={200}
                        bgColor="transparent"
                        fgColor="#00D4FF"
                        level="M"
                        includeMargin={false}
                        imageSettings={{
                          src: '',
                          height: 0,
                          width: 0,
                          excavate: true,
                        }}
                      />
                    ) : (
                      <div className="w-[200px] h-[200px] rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <QrCode size={48} style={{ color: 'rgba(255,255,255,0.2)' }} />
                      </div>
                    )}
                    <p className="mt-4 text-sm font-medium" style={{ color: '#fff' }}>
                      {adName || 'Your Ad'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {adUrl || 'Enter a URL to generate QR code'}
                    </p>
                  </div>
                </motion.div>
              )}

              {previewMode === 'embed' && (
                <motion.div
                  key="embed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        HTML Embed Code
                      </span>
                      <button
                        onClick={handleCopyEmbed}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                        style={{
                          background: embedCopied ? 'rgba(0,255,136,0.1)' : 'rgba(0,212,255,0.1)',
                          color: embedCopied ? '#00FF88' : '#00D4FF',
                          border: `1px solid ${embedCopied ? 'rgba(0,255,136,0.2)' : 'rgba(0,212,255,0.2)'}`,
                        }}
                      >
                        {embedCopied ? <Check size={12} /> : <Copy size={12} />}
                        {embedCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre
                      className="p-4 text-xs overflow-x-auto"
                      style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontFamily: 'monospace',
                        maxHeight: '300px',
                        overflowY: 'auto',
                      }}
                    >
                      <code>{embedCode}</code>
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
