import React, { useState } from 'react';
import { useGeckoContext } from '../context/GeckoContext';
import type { Gecko } from '../types/gecko';
import { QRCodeSVG } from 'qrcode.react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { EditGeckoModal } from './EditGeckoModal';
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
                    src={gecko.mainImageUrl || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80'}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>{activeGecko.name}</h3>
                <span className={`badge badge-gender-${activeGecko.gender}`}>{activeGecko.gender}</span>
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

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Profile Top Summary & Image Gallery */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(() => {
                    const geckoImages = activeGecko.images && activeGecko.images.length > 0
                      ? activeGecko.images
                      : (activeGecko.mainImageUrl ? [activeGecko.mainImageUrl] : []);
                    const currentImg = geckoImages[activePhotoIdx] || geckoImages[0] || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80';

                    return (
                      <>
                        <img 
                          src={currentImg}
                          alt={activeGecko.name}
                          style={{ width: '100%', height: 190, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}
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


                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <h4 style={{ color: '#10b981', fontSize: '1.15rem', fontWeight: 700 }}>{activeGecko.morph}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Kód: <strong style={{ color: '#f8fafc' }}>{activeGecko.code}</strong></p>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Tenyésztő / Származás: <strong style={{ color: '#f8fafc' }}>{activeGecko.breederName || 'Saját tenyészet'}</strong></p>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Vásárlási Ár: <strong style={{ color: '#38bdf8' }}>{activeGecko.purchasePrice ? `${activeGecko.purchasePrice.toLocaleString()} HUF` : 'Saját kikelés'}</strong></p>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Kikelési Dátum: <strong style={{ color: '#f8fafc' }}>{activeGecko.hatchDate || 'Ismeretlen'}</strong></p>
                  {activeGecko.notes && (
                    <p style={{ color: '#cbd5e1', fontSize: '0.85rem', background: 'rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: 8, marginTop: '0.4rem' }}>
                      📝 {activeGecko.notes}
                    </p>
                  )}
                </div>
              </div>

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

