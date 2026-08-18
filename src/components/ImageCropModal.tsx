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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

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
  }, [imageSrc]);

  useEffect(() => {
    if (imageRef.current) {
      drawCanvas(imageRef.current, zoom, rotation, position);
    }
  }, [zoom, rotation, position]);

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

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // Move to center
    ctx.translate(width / 2 + currentPos.x, height / 2 + currentPos.y);
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

    // Create a 800x800 output canvas for optimal photo quality
    const outputCanvas = document.createElement('canvas');
    const outputSize = 800;
    outputCanvas.width = outputSize;
    outputCanvas.height = outputSize;
    const outCtx = outputCanvas.getContext('2d');

    if (!outCtx) return;

    // Crop box in preview canvas is the central 340x340 area
    const cropBoxSize = 340;
    const scaleFactor = outputSize / cropBoxSize;

    outCtx.save();
    outCtx.scale(scaleFactor, scaleFactor);
    outCtx.translate(cropBoxSize / 2, cropBoxSize / 2);
    outCtx.translate(position.x, position.y);
    outCtx.rotate((rotation * Math.PI) / 180);
    outCtx.scale(zoom, zoom);
    outCtx.drawImage(imageRef.current, -imageRef.current.width / 2, -imageRef.current.height / 2);
    outCtx.restore();

    const croppedDataUrl = outputCanvas.toDataURL('image/jpeg', 0.88);
    onCropComplete(croppedDataUrl);
    onClose();
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 500, textAlign: 'center' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crop color="#10b981" size={20} /> Kép Kivágása & Pozicionálása
          </h3>
          <button onClick={onClose} className="btn btn-secondary btn-sm"><X size={16} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            Húzd az egérrel a képet a kivágó négyzetbe, használd a nagyítást vagy forgatást.
          </p>

          {/* Canvas Preview Box */}
          <div 
            style={{
              position: 'relative',
              width: 340,
              height: 340,
              borderRadius: 12,
              overflow: 'hidden',
              background: '#0f172a',
              cursor: isDragging ? 'grabbing' : 'grab',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.4)'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas 
              ref={canvasRef} 
              width={340} 
              height={340} 
              style={{ width: '100%', height: '100%', display: 'block' }}
            />

            {/* Crop Overlay Grid */}
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              border: '2px dashed rgba(255, 255, 255, 0.8)',
              borderRadius: 10,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)'
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
