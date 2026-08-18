import React, { useState } from 'react';
import { useGeckoContext } from '../context/GeckoContext';
import type { Gender, GeckoStatus, GeckoGenetics } from '../types/gecko';
import { DEFAULT_GENETICS, buildMorphString } from '../utils/genetics';
import { PlusCircle, Dna, Upload, Link, Crop } from 'lucide-react';
import { ImageCropModal } from './ImageCropModal';

const compressImage = (file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.9): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const AddGeckoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { geckos, addGecko } = useGeckoContext();

  const [name, setName] = useState('');
  const [code, setCode] = useState(`CG-2024-${Math.floor(100 + Math.random() * 900)}`);
  const [gender, setGender] = useState<Gender>('unsexed');
  const [hatchDate, setHatchDate] = useState('');
  const [status, setStatus] = useState<GeckoStatus>('breeder');
  const [breederName, setBreederName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [fatherId, setFatherId] = useState<string>('');
  const [motherId, setMotherId] = useState<string>('');
  const [weightGrams, setWeightGrams] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [cropIndex, setCropIndex] = useState<number>(0);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  // Genetics flags
  const [genetics, setGenetics] = useState<GeckoGenetics>({ ...DEFAULT_GENETICS });

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const dataUrl = await compressImage(file);
      setRawImageSrc(dataUrl);
      setCropIndex(targetIndex !== undefined ? targetIndex : images.length);
      setIsCropOpen(true);
    } catch (err) {
      console.error('Kép feldolgozási hiba:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim() || images.length >= 3) return;
    setImages(prev => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const calculatedMorph = buildMorphString(genetics);

    addGecko({
      name: name.trim(),
      code: code.trim(),
      gender,
      hatchDate: hatchDate || undefined,
      morph: calculatedMorph,
      genetics,
      status,
      breederName: breederName.trim() || undefined,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      fatherId: fatherId || undefined,
      motherId: motherId || undefined,
      weightGrams: weightGrams ? parseFloat(weightGrams) : undefined,
      notes: notes.trim() || undefined,
      mainImageUrl: images[0] || undefined,
      images: images
    });

    onClose();
  };


  const maleGeckos = geckos.filter(g => g.gender === 'male');
  const femaleGeckos = geckos.filter(g => g.gender === 'female');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle color="#10b981" size={22} /> Új Vitorlás Gekkó Hozzáadása
          </h3>
          <button onClick={onClose} className="btn btn-secondary btn-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Gekkó Neve *</label>
                <input type="text" required className="form-input" placeholder="pl. Loki" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Azonosító (Kód)</label>
                <input type="text" className="form-input" value={code} onChange={e => setCode(e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Nem</label>
                <select className="form-select" value={gender} onChange={e => setGender(e.target.value as Gender)}>
                  <option value="unsexed">❓ Unsexed</option>
                  <option value="male">♂ Hím</option>
                  <option value="female">♀ Nőstény</option>
                </select>
              </div>
            </div>

            {/* Status & Purchase */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Státusz</label>
                <select className="form-select" value={status} onChange={e => setStatus(e.target.value as GeckoStatus)}>
                  <option value="breeder">Tenyészállat</option>
                  <option value="for_sale">Eladó</option>
                  <option value="reserved">Foglalt</option>
                  <option value="sold">Eladott</option>
                  <option value="pet">Kedvenc</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Vásárolt Tenyésztő</label>
                <input type="text" className="form-input" placeholder="pl. Repashy Lineage" value={breederName} onChange={e => setBreederName(e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Vásárlási Ár (HUF)</label>
                <input type="number" className="form-input" placeholder="pl. 150000" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} />
              </div>
            </div>

            {/* Parents selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">♂ APA az adatbázisból:</label>
                <select className="form-select" value={fatherId} onChange={e => setFatherId(e.target.value)}>
                  <option value="">Nincs apai adat</option>
                  {maleGeckos.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">♀ ANYA az adatbázisból:</label>
                <select className="form-select" value={motherId} onChange={e => setMotherId(e.target.value)}>
                  <option value="">Nincs anyai adat</option>
                  {femaleGeckos.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.code})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Kezdő Súly (g):</label>
                <input type="number" step="0.1" className="form-input" placeholder="pl. 45.2" value={weightGrams} onChange={e => setWeightGrams(e.target.value)} />
              </div>
            </div>

            {/* Max 3 WebP Images Upload & Hatch Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Gekkó Fotók (Max 3 db WebP fotó) — <span style={{ color: '#34d399' }}>{images.length}/3 feltöltve</span>
                  </label>

                  <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.3)', padding: 2, borderRadius: 6 }}>
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      style={{
                        background: imageMode === 'upload' ? '#10b981' : 'transparent',
                        color: imageMode === 'upload' ? '#fff' : '#94a3b8',
                        border: 'none',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Upload size={12} /> Feltöltés
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      style={{
                        background: imageMode === 'url' ? '#10b981' : 'transparent',
                        color: imageMode === 'url' ? '#fff' : '#94a3b8',
                        border: 'none',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Link size={12} /> URL Link
                    </button>
                  </div>
                </div>

                {imageMode === 'upload' ? (
                  images.length < 3 && (
                    <label 
                      style={{
                        border: '2px dashed rgba(16, 185, 129, 0.4)',
                        borderRadius: 10,
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.6rem',
                        cursor: 'pointer',
                        background: 'rgba(16, 185, 129, 0.05)',
                        color: '#34d399',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginBottom: '0.75rem'
                      }}
                    >
                      <Upload size={18} />
                      {isUploading ? 'Feldolgozás...' : `+ Kép Hozzáadása (${3 - images.length} hely maradt, Auto-WebP)`}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => handleFileUpload(e)} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  )
                ) : (
                  images.length < 3 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <input 
                        type="url" 
                        className="form-input" 
                        placeholder="https://..." 
                        value={urlInput} 
                        onChange={e => setUrlInput(e.target.value)} 
                      />
                      <button type="button" onClick={handleAddUrl} className="btn btn-secondary btn-sm">Hozzáadás</button>
                    </div>
                  )
                )}

                {/* 3-Slot Thumbnail Gallery List */}
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {images.map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        position: 'relative',
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: idx === 0 ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                        background: '#0f172a'
                      }}
                    >
                      <img src={imgUrl} alt={`Foto ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      
                      {idx === 0 ? (
                        <span style={{ position: 'absolute', top: 2, left: 2, background: '#10b981', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '0.1rem 0.3rem', borderRadius: 4 }}>
                          FŐKÉP
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(idx)}
                          title="Beállítás főképpé"
                          style={{ position: 'absolute', top: 2, left: 2, background: 'rgba(0,0,0,0.6)', color: '#fbbf24', border: 'none', fontSize: '0.6rem', padding: '0.1rem 0.3rem', borderRadius: 4, cursor: 'pointer' }}
                        >
                          ★ Főképpé
                        </button>
                      )}

                      <div style={{ position: 'absolute', bottom: 2, right: 2, display: 'flex', gap: 2 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setRawImageSrc(imgUrl);
                            setCropIndex(idx);
                            setIsCropOpen(true);
                          }}
                          style={{ background: 'rgba(0,0,0,0.7)', color: '#38bdf8', border: 'none', borderRadius: 3, padding: '0.15rem 0.3rem', cursor: 'pointer' }}
                          title="Újravágás"
                        >
                          <Crop size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          style={{ background: 'rgba(0,0,0,0.7)', color: '#f43f5e', border: 'none', borderRadius: 3, padding: '0.15rem 0.3rem', cursor: 'pointer' }}
                          title="Törlés"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Kikelési Dátum</label>
                <input type="date" className="form-input" value={hatchDate} onChange={e => setHatchDate(e.target.value)} />
              </div>
            </div>

            {/* Image Crop Modal */}
            <ImageCropModal
              imageSrc={rawImageSrc}
              isOpen={isCropOpen}
              onClose={() => setIsCropOpen(false)}
              onCropComplete={(croppedUrl) => {
                setImages(prev => {
                  const updated = [...prev];
                  updated[cropIndex] = croppedUrl;
                  return updated.slice(0, 3);
                });
                setIsCropOpen(false);
              }}
            />




            {/* Genetics Flags */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 10,
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Dna size={16} /> Genetikai Értékek & Morph Beállítása
              </h4>

              {/* Base Morphs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Axanthic:</label>
                  <select className="form-select" value={genetics.axanthic} onChange={e => setGenetics({ ...genetics, axanthic: e.target.value as any })}>
                    <option value="none">Nem</option>
                    <option value="het">100% Het Axanthic</option>
                    <option value="visual">Visual Axanthic</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Cappuccino:</label>
                  <select className="form-select" value={genetics.cappuccino} onChange={e => setGenetics({ ...genetics, cappuccino: e.target.value as any })}>
                    <option value="none">Nem</option>
                    <option value="visual">Cappuccino</option>
                    <option value="super">Super Cappuccino</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Alap Mintázat (Pattern):</label>
                  <select className="form-select" value={genetics.pattern} onChange={e => setGenetics({ ...genetics, pattern: e.target.value as any })}>
                    <option value="harlequin">Harlequin</option>
                    <option value="extreme_harlequin">Extreme Harlequin</option>
                    <option value="flame">Flame</option>
                    <option value="tricolor">Tricolor</option>
                    <option value="bicolor">Bicolor</option>
                    <option value="patternless">Patternless</option>
                  </select>
                </div>
              </div>

              {/* Pinstripe & Dalmatian */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ color: '#fbbf24', fontWeight: 700 }}>
                    ⚡ Pinstripe (Csíkozottság):
                  </label>
                  <select className="form-select" value={genetics.pinstripe} onChange={e => setGenetics({ ...genetics, pinstripe: e.target.value as any })}>
                    <option value="none">Nincs Pinstripe</option>
                    <option value="low">Low Pinstripe (&lt;50%)</option>
                    <option value="partial">Partial Pinstripe (50-99%)</option>
                    <option value="full">Full Pinstripe (100%)</option>
                    <option value="quadstripe">Quadstripe (Háti + Oldalsó csík)</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ color: '#c084fc', fontWeight: 700 }}>
                    🐾 Dalmatian (Pettyezettség):
                  </label>
                  <select className="form-select" value={genetics.dalmatian} onChange={e => setGenetics({ ...genetics, dalmatian: e.target.value as any })}>
                    <option value="none">Nincs Dalmatian petty</option>
                    <option value="low">Dalmatian (Kevés petty)</option>
                    <option value="high">High Spot Dalmatian (Sok petty)</option>
                    <option value="super">Super Dalmatian (100+ petty)</option>
                  </select>
                </div>
              </div>

              {/* Additional Genetic Traits Checkboxes */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '0.75rem',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '0.75rem 1rem',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#f8fafc' }}>
                  <input type="checkbox" checked={!!genetics.hypo} onChange={e => setGenetics({ ...genetics, hypo: e.target.checked })} style={{ accentColor: '#10b981' }} />
                  <span>Hypo</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#f8fafc' }}>
                  <input type="checkbox" checked={genetics.lillyWhite} onChange={e => setGenetics({ ...genetics, lillyWhite: e.target.checked })} style={{ accentColor: '#10b981' }} />
                  <span>Lilly White</span>
                </label>


                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#f8fafc' }}>
                  <input type="checkbox" checked={genetics.phantom} onChange={e => setGenetics({ ...genetics, phantom: e.target.checked })} style={{ accentColor: '#10b981' }} />
                  <span>Phantom</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#f8fafc' }}>
                  <input type="checkbox" checked={genetics.sable} onChange={e => setGenetics({ ...genetics, sable: e.target.checked })} style={{ accentColor: '#10b981' }} />
                  <span>Sable</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#f8fafc' }}>
                  <input type="checkbox" checked={genetics.whitewall} onChange={e => setGenetics({ ...genetics, whitewall: e.target.checked })} style={{ accentColor: '#10b981' }} />
                  <span>Whitewall</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#f8fafc' }}>
                  <input type="checkbox" checked={genetics.inkSpot} onChange={e => setGenetics({ ...genetics, inkSpot: e.target.checked })} style={{ accentColor: '#10b981' }} />
                  <span>Ink Spot</span>
                </label>
              </div>

              {/* Calculated Live Morph Name */}
              <div style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '0.65rem 0.85rem',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <span>✨ Számított Morph Megnevezés:</span>
                <strong style={{ color: '#34d399', fontSize: '1rem' }}>{buildMorphString(genetics)}</strong>
              </div>
            </div>


            {/* Notes */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tenyésztői Megjegyzések</label>
              <textarea className="form-textarea" rows={2} placeholder="Karakter, táplálkozási szokások, különleges tulajdonságok..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

          </div>

          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">Gekkó Mentése az Adatbázisba</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Mégse</button>
          </div>
        </form>
      </div>
    </div>
  );
};
