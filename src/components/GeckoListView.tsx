import React, { useState } from 'react';
import { useGeckoContext } from '../context/GeckoContext';
import type { Gecko } from '../types/gecko';
import { QRCodeSVG } from 'qrcode.react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { EditGeckoModal } from './EditGeckoModal';
import { getGeckoImage, DEFAULT_GECKO_IMAGE } from '../utils/imageHelper';
import { 

  Search, 
  Plus, 
  Scale, 
  QrCode, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  Dna,
  Edit3
} from 'lucide-react';

export const GeckoListView: React.FC<{
  onOpenAddModal: () => void;
}> = ({ onOpenAddModal }) => {
  const { geckos, weights, deleteGecko, addWeightLog, setSelectedGeckoId, setActiveTab } = useGeckoContext();

  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'weight' | 'date'>('date');

  // Selected gecko for profile modal & editing modal
  const [activeGecko, setActiveGecko] = useState<Gecko | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [editingGecko, setEditingGecko] = useState<Gecko | null>(null);
  const [showQrModal, setShowQrModal] = useState<Gecko | null>(null);
  const [newWeightInput, setNewWeightInput] = useState<string>('');


  // Filtering
  const filteredGeckos = geckos.filter(g => {
    const matchesSearch = 
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.code.toLowerCase().includes(search.toLowerCase()) ||
      g.morph.toLowerCase().includes(search.toLowerCase()) ||
      (g.breederName && g.breederName.toLowerCase().includes(search.toLowerCase()));

    const matchesGender = genderFilter === 'all' || g.gender === genderFilter;
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;

    return matchesSearch && matchesGender && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'weight') return (b.weightGrams || 0) - (a.weightGrams || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const geckoWeights = activeGecko 
    ? weights.filter(w => w.geckoId === activeGecko.id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const handleAddWeight = () => {
    if (!activeGecko || !newWeightInput) return;
    const grams = parseFloat(newWeightInput);
    if (!isNaN(grams) && grams > 0) {
      addWeightLog(activeGecko.id, grams);
      setNewWeightInput('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Search & Filter Bar */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} size={18} />
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Keresés név, kód, morph vagy vásárolt tenyésztő alapján..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select className="form-select" style={{ width: 'auto' }} value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
              <option value="all">Minden nem</option>
              <option value="male">♂ Hím</option>
              <option value="female">♀ Nőstény</option>
              <option value="unsexed">❓ Unsexed</option>
            </select>

            <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Minden státusz</option>
              <option value="breeder">Tenyészállat</option>
              <option value="for_sale">Eladó</option>
              <option value="reserved">Foglalt</option>
              <option value="sold">Eladott</option>
              <option value="pet">Kedvenc</option>
            </select>

            <select className="form-select" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="date">Legújabb elöl</option>
              <option value="name">Név szerint (A-Z)</option>
              <option value="weight">Súly szerint (Legnehezebb)</option>
            </select>

            <button onClick={onOpenAddModal} className="btn btn-primary btn-sm">
              <Plus size={16} /> Új Gekkó
            </button>
          </div>
        </div>
      </div>

      {/* Geckos Grid */}
      {filteredGeckos.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <p style={{ fontSize: '1.1rem' }}>Nem található a keresésnek megfelelő gekkó az adatbázisban.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredGeckos.map(gecko => (
            <div 
              key={gecko.id}
              className="glass-card glass-card-interactive"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                {/* Image Header (4:3 Ratio) */}
                <div style={{ aspectRatio: '4 / 3', position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
                  <img 
                    src={getGeckoImage(gecko)}
                    alt={gecko.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />


                  {/* Top Gradient Vignette for Badges */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)',
                    pointerEvents: 'none'
                  }} />

                  <span className={`badge badge-gender-${gecko.gender}`} style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                    {gecko.gender === 'male' ? '♂ Hím' : gecko.gender === 'female' ? '♀ Nőstény' : '❓ Unsexed'}
                  </span>
                  <span className={`badge badge-status-${gecko.status}`} style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
                    {gecko.status === 'breeder' ? 'Tenyész' : gecko.status === 'for_sale' ? 'Eladó' : gecko.status}
                  </span>
                </div>


                {/* Content */}
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>{gecko.name}</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: 4 }}>
                      {gecko.code}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 700, marginBottom: '0.85rem' }}>
                    {gecko.morph}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    <span>⚖️ Súly: <strong style={{ color: '#f8fafc' }}>{gecko.weightGrams ? `${gecko.weightGrams}g` : 'Nincs mérés'}</strong></span>
                    <span>🏠 Vásárolt tenyésztő: <strong style={{ color: '#f8fafc' }}>{gecko.breederName || 'Saját tenyészet'}</strong></span>
                    <span>🎂 Kikelés: <strong style={{ color: '#f8fafc' }}>{gecko.hatchDate || 'Ismeretlen'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{
                padding: '0.85rem 1.25rem',
                background: 'rgba(0, 0, 0, 0.2)',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button 
                    title="QR Kód Matrica"
                    onClick={() => setShowQrModal(gecko)}
                    className="btn btn-secondary btn-sm"
                  >
                    <QrCode size={16} />
                  </button>
                  <button 
                    title="Családfa megtekintése"
                    onClick={() => {
                      setSelectedGeckoId(gecko.id);
                      setActiveTab('lineage');
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    <Dna size={16} />
                  </button>
                  <button 
                    title="Adatlap Szerkesztése"
                    onClick={() => setEditingGecko(gecko)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#38bdf8' }}
                  >
                    <Edit3 size={16} />
                  </button>
                </div>

                <button 
                  onClick={() => setActiveGecko(gecko)}
                  className="btn btn-primary btn-sm"
                >
                  Adatlap <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gecko Profile Detail & Weight Chart Modal */}
      {activeGecko && (
        <div className="modal-overlay" onClick={() => setActiveGecko(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 800 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>{activeGecko.name}</h3>
                <span className={`badge badge-gender-${activeGecko.gender}`}>
                  {activeGecko.gender === 'male' ? '♂ Hím' : activeGecko.gender === 'female' ? '♀ Nőstény' : '❓ Unsexed'}
                </span>
                <span className={`badge badge-status-${activeGecko.status}`}>
                  {activeGecko.status === 'breeder' ? 'Tenyészállat' : activeGecko.status === 'for_sale' ? 'Eladó' : activeGecko.status === 'reserved' ? 'Foglalt' : activeGecko.status === 'sold' ? 'Eladott' : 'Kedvenc'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  onClick={() => {
                    const toEdit = activeGecko;
                    setActiveGecko(null);
                    setEditingGecko(toEdit);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Edit3 size={14} /> Szerkesztés
                </button>
                <button onClick={() => setActiveGecko(null)} className="btn btn-secondary btn-sm">✕</button>
              </div>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Profile Top Summary & Image Gallery */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', alignItems: 'flex-start' }}>
                {/* Photo Gallery */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(() => {
                    const geckoImages = activeGecko.images && activeGecko.images.length > 0
                      ? activeGecko.images
                      : (activeGecko.mainImageUrl ? [activeGecko.mainImageUrl] : []);
                    const currentImg = geckoImages[activePhotoIdx] || geckoImages[0] || DEFAULT_GECKO_IMAGE;

                    return (
                      <>
                        <img 
                          src={currentImg}
                          alt={activeGecko.name}
                          style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        {geckoImages.length > 1 && (
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                            {geckoImages.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt={`Foto ${i + 1}`}
                                onClick={() => setActivePhotoIdx(i)}
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 6,
                                  objectFit: 'cover',
                                  cursor: 'pointer',
                                  border: activePhotoIdx === i ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
                                  opacity: activePhotoIdx === i ? 1 : 0.6
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Primary Metadata Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h4 style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{activeGecko.morph}</h4>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.65rem',
                    background: 'rgba(0,0,0,0.25)',
                    padding: '0.85rem',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '0.825rem'
                  }}>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem' }}>🏷️ Törzskönyvi Kód:</span>
                      <strong style={{ color: '#f8fafc' }}>{activeGecko.code}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem' }}>⚖️ Súly:</span>
                      <strong style={{ color: '#38bdf8' }}>{activeGecko.weightGrams ? `${activeGecko.weightGrams} g` : 'Nincs mérés'}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem' }}>🎂 Kikelési Dátum:</span>
                      <strong style={{ color: '#f8fafc' }}>{activeGecko.hatchDate || 'Ismeretlen'}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem' }}>🏠 Tenyésztő / Származás:</span>
                      <strong style={{ color: '#f8fafc' }}>{activeGecko.breederName || 'Saját tenyészet'}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem' }}>💰 Vásárlási Ár:</span>
                      <strong style={{ color: '#fbbf24' }}>{activeGecko.purchasePrice ? `${activeGecko.purchasePrice.toLocaleString()} HUF` : 'Saját kikelés'}</strong>
                    </div>

                    {activeGecko.purchaseDate && (
                      <div>
                        <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem' }}>📅 Vásárlás Dátuma:</span>
                        <strong style={{ color: '#f8fafc' }}>{activeGecko.purchaseDate}</strong>
                      </div>
                    )}

                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem' }}>⏱️ Rögzítés Dátuma:</span>
                      <strong style={{ color: '#cbd5e1' }}>{new Date(activeGecko.createdAt).toLocaleDateString('hu-HU')}</strong>
                    </div>
                  </div>

                  {/* Parents Quick Section */}
                  {(() => {
                    const fGecko = activeGecko.fatherId ? geckos.find(g => g.id === activeGecko.fatherId) : null;
                    const mGecko = activeGecko.motherId ? geckos.find(g => g.id === activeGecko.motherId) : null;
                    const fName = fGecko ? fGecko.name : (activeGecko.fatherName || null);
                    const mName = mGecko ? mGecko.name : (activeGecko.motherName || null);
                    const fPic = fGecko?.mainImageUrl || activeGecko.fatherImageUrl;
                    const mPic = mGecko?.mainImageUrl || activeGecko.motherImageUrl;

                    if (!fName && !mName) return null;

                    return (
                      <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>🧬 Szülők & Családfa:</span>
                        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                          {fName && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {fPic ? (
                                <img src={fPic} alt="Apa" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', border: '1px solid #38bdf8' }} />
                              ) : (
                                <span style={{ fontSize: '0.85rem' }}>♂</span>
                              )}
                              <div>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>APA</span>
                                <strong style={{ fontSize: '0.825rem', color: '#38bdf8' }}>{fName}</strong>
                              </div>
                            </div>
                          )}
                          {mName && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {mPic ? (
                                <img src={mPic} alt="Anya" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', border: '1px solid #fb7185' }} />
                              ) : (
                                <span style={{ fontSize: '0.85rem' }}>♀</span>
                              )}
                              <div>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>ANYA</span>
                                <strong style={{ fontSize: '0.825rem', color: '#fb7185' }}>{mName}</strong>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Genetics Badges Summary */}
              {activeGecko.genetics && (
                <div style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                  padding: '0.85rem 1rem'
                }}>
                  <h5 style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Dna size={14} /> Regisztrált Genetikai Tulajdonságok
                  </h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {activeGecko.genetics.hypo && <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>Hypo</span>}
                    {activeGecko.genetics.lillyWhite && <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>Lilly White</span>}
                    {activeGecko.genetics.axanthic === 'visual' && <span className="badge" style={{ background: 'rgba(192, 132, 252, 0.2)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.4)' }}>Visual Axanthic</span>}
                    {activeGecko.genetics.axanthic === 'het' && <span className="badge" style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#e9d5ff', border: '1px solid rgba(192, 132, 252, 0.3)' }}>100% Het Axanthic</span>}
                    {activeGecko.genetics.cappuccino === 'super' && <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.4)' }}>Super Cappuccino</span>}
                    {activeGecko.genetics.cappuccino === 'visual' && <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)' }}>Cappuccino</span>}
                    {activeGecko.genetics.phantom && <span className="badge" style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#cbd5e1', border: '1px solid rgba(148, 163, 184, 0.4)' }}>Phantom</span>}
                    {activeGecko.genetics.sable && <span className="badge" style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#cbd5e1', border: '1px solid rgba(148, 163, 184, 0.4)' }}>Sable</span>}
                    {activeGecko.genetics.pattern && activeGecko.genetics.pattern !== 'patternless' && (
                      <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                        Mintázat: {activeGecko.genetics.pattern.replace('_', ' ')}
                      </span>
                    )}
                    {activeGecko.genetics.pinstripe && activeGecko.genetics.pinstripe !== 'none' && (
                      <span className="badge" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
                        Pinstripe: {activeGecko.genetics.pinstripe}
                      </span>
                    )}
                    {activeGecko.genetics.dalmatian && activeGecko.genetics.dalmatian !== 'none' && (
                      <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                        Dalmatian: {activeGecko.genetics.dalmatian}
                      </span>
                    )}
                    {activeGecko.genetics.whitewall && <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}>Whitewall</span>}
                    {activeGecko.genetics.inkSpot && <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}>Ink Spot</span>}
                  </div>
                </div>
              )}

              {activeGecko.notes && (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>📝 Tenyésztői Megjegyzések:</span>
                  <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0, whiteSpace: 'pre-wrap' }}>{activeGecko.notes}</p>
                </div>
              )}


              {/* Weight Log & Chart Section */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp color="#34d399" size={20} /> Súlyfejlődési Grafikon (gramm)
                  </h4>

                  {/* Add weight inline form */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="number"
                      placeholder="Súly (g)"
                      className="form-input"
                      style={{ width: 100, padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                      value={newWeightInput}
                      onChange={e => setNewWeightInput(e.target.value)}
                    />
                    <button onClick={handleAddWeight} className="btn btn-primary btn-sm">
                      <Scale size={14} /> Mérés Rögzítése
                    </button>
                  </div>
                </div>

                {geckoWeights.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Még nincs rögzített súlyfejlődési bejegyzés.</p>
                ) : (
                  <div style={{ height: 220, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={geckoWeights}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} unit="g" />
                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
                        <Line type="monotone" dataKey="weightGrams" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => {
                  deleteGecko(activeGecko.id);
                  setActiveGecko(null);
                }}
                className="btn btn-danger"
              >
                <Trash2 size={16} /> Törlés
              </button>
              <button 
                onClick={() => {
                  const toEdit = activeGecko;
                  setActiveGecko(null);
                  setEditingGecko(toEdit);
                }}
                className="btn btn-primary"
              >
                <Edit3 size={16} /> Adatlap Szerkesztése
              </button>
              <button onClick={() => setActiveGecko(null)} className="btn btn-secondary">Bezárás</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Gecko Modal */}
      <EditGeckoModal
        gecko={editingGecko}
        isOpen={Boolean(editingGecko)}
        onClose={() => setEditingGecko(null)}
      />

      {/* QR Code Printable Tag Modal */}
      {showQrModal && (
        <div className="modal-overlay" onClick={() => setShowQrModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420, textAlign: 'center' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                🏷️ Terrárium / Doboz Matrica QR Kód
              </h3>
              <button onClick={() => setShowQrModal(null)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <div className="modal-body" style={{ background: '#ffffff', color: '#0f172a', padding: '2rem', borderRadius: 8 }}>
              <div style={{ border: '2px dashed #0f172a', padding: '1.5rem', borderRadius: 12 }}>
                <QRCodeSVG value={`https://gecko-hub.app/gecko/${showQrModal.id}`} size={160} />
                <h3 style={{ marginTop: '1rem', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>{showQrModal.name}</h3>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>{showQrModal.code}</p>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.2rem' }}>{showQrModal.morph}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => window.print()} className="btn btn-primary">Nyomtatás</button>
              <button onClick={() => setShowQrModal(null)} className="btn btn-secondary">Bezárás</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

