import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  title?: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  imageSrc,
  title,
  onClose
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 15, 0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      {/* Top Bar */}
      <div 
        onClick={e => e.stopPropagation()} 
        style={{
          width: '100%',
          maxWidth: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          color: '#f8fafc'
        }}
      >
        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>
          {title || '🔍 Kép Nagyítás'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setIsZoomed(prev => !prev)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}
          >
            {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
            {isZoomed ? 'Normál Nézet' : 'Extra Nagyítás'}
          </button>
          <button 
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: 36, height: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Large Image Display */}
      <div 
        onClick={e => e.stopPropagation()} 
        style={{
          position: 'relative',
          maxWidth: isZoomed ? '100%' : '90vw',
          maxHeight: isZoomed ? '100%' : '82vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: isZoomed ? 'auto' : 'hidden',
          borderRadius: 16,
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <img
          src={imageSrc}
          alt={title || 'Nagyított kép'}
          onClick={() => setIsZoomed(prev => !prev)}
          style={{
            maxWidth: isZoomed ? 'none' : '90vw',
            maxHeight: isZoomed ? 'none' : '82vh',
            width: isZoomed ? 'auto' : '100%',
            height: isZoomed ? 'auto' : '100%',
            objectFit: 'contain',
            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
            transition: 'transform 0.2s ease',
            borderRadius: 16
          }}
        />
      </div>
    </div>
  );
};
