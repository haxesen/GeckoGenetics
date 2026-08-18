import React, { useState, useRef, useEffect } from 'react';
import { Crop, ZoomIn, ZoomOut, RotateCw, Check, X } from 'lucide-react';

interface ImageCropModalProps {
  imageSrc: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState<'4:3' | '1:1'>('4:3');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Dimensions for preview box
  const cropW = 360;
  const cropH = aspectRatio === '4:3' ? 270 : 360;

  // Load image object when imageSrc changes
  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        imageRef.current = img;
        setZoom(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
        drawCanvas(img, 1, 0, { x: 0, y: 0 });
      };
    }
  }, [imageSrc, aspectRatio]);

  useEffect(() => {
    if (imageRef.current) {
      drawCanvas(imageRef.current, zoom, rotation, position);
    }
  }, [zoom, rotation, position, aspectRatio]);

  const drawCanvas = (
    img: HTMLImageElement,
    currentZoom: number,
    currentRotation: number,
    currentPos: { x: number; y: number }
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, cropW, cropH);

    ctx.save();
    // Move to center
    ctx.translate(cropW / 2 + currentPos.x, cropH / 2 + currentPos.y);
    ctx.rotate((currentRotation * Math.PI) / 180);
    ctx.scale(currentZoom, currentZoom);

    // Draw image centered
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    // Create high-res output canvas
    const outputCanvas = document.createElement('canvas');
    const outW = 800;
    const outH = aspectRatio === '4:3' ? 600 : 800;

    outputCanvas.width = outW;
    outputCanvas.height = outH;
    const outCtx = outputCanvas.getContext('2d');

    if (!outCtx) return;

    const scaleFactor = outW / cropW;

    outCtx.save();
    outCtx.scale(scaleFactor, scaleFactor);
    outCtx.translate(cropW / 2, cropH / 2);
    outCtx.translate(position.x, position.y);
    outCtx.rotate((rotation * Math.PI) / 180);
    outCtx.scale(zoom, zoom);
    outCtx.drawImage(imageRef.current, -imageRef.current.width / 2, -imageRef.current.height / 2);
    outCtx.restore();

    const croppedDataUrl = outputCanvas.toDataURL('image/webp', 0.85);
    onCropComplete(croppedDataUrl);
    onClose();
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 520, textAlign: 'center' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crop color="#10b981" size={20} /> Kép Kivágása & Pozicionálása
          </h3>
          <button onClick={onClose} className="btn btn-secondary btn-sm"><X size={16} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Méretarány:</span>
            <button
              type="button"
              onClick={() => setAspectRatio('4:3')}
              className={`btn btn-sm ${aspectRatio === '4:3' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
            >
              4:3 (Kártya méret - Ajánlott)
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio('1:1')}
              className={`btn btn-sm ${aspectRatio === '1:1' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
            >
              1:1 (Négyzet)
            </button>
          </div>

          {/* Canvas Preview Box */}
          <div 
            style={{
              position: 'relative',
              width: cropW,
              height: cropH,
              borderRadius: 12,
              overflow: 'hidden',
              background: '#0f172a',
              cursor: isDragging ? 'grabbing' : 'grab',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.4)',
              transition: 'height 0.2s ease'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas 
              ref={canvasRef} 
              width={cropW} 
              height={cropH} 
              style={{ width: '100%', height: '100%', display: 'block' }}
            />

            {/* Crop Overlay Grid */}
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              border: '2px dashed rgba(255, 255, 255, 0.8)',
              borderRadius: 10,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.35)'
            }}>
              {/* Grid lines */}
              <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: 1, background: 'rgba(255, 255, 255, 0.25)' }} />
              <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: 1, background: 'rgba(255, 255, 255, 0.25)' }} />
              <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: 1, background: 'rgba(255, 255, 255, 0.25)' }} />
              <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: 1, background: 'rgba(255, 255, 255, 0.25)' }} />
            </div>
          </div>

          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '0.75rem 1rem',
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
              <ZoomOut size={16} color="#94a3b8" />
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.05" 
                value={zoom} 
                onChange={e => setZoom(parseFloat(e.target.value))} 
                style={{ flex: 1, accentColor: '#10b981', cursor: 'pointer' }} 
              />
              <ZoomIn size={16} color="#94a3b8" />
            </div>

            <button
              type="button"
              onClick={() => setRotation(r => (r + 90) % 360)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              title="Forgatás 90°-kal"
            >
              <RotateCw size={14} /> 90°
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={handleCrop} className="btn btn-primary">
            <Check size={16} /> Kivágás & Alkalmazás
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Mégse
          </button>
        </div>
      </div>
    </div>
  );
};
