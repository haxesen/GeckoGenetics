import React, { useState } from 'react';
import { useGeckoContext } from '../context/GeckoContext';
import type { Gecko } from '../types/gecko';
import { 
  GitFork, 
  Award, 
  Printer,
  ShieldAlert
} from 'lucide-react';

export const LineageView: React.FC = () => {
  const { geckos, selectedGeckoId, setSelectedGeckoId } = useGeckoContext();

  const [currentId, setCurrentId] = useState<string>(selectedGeckoId || geckos[0]?.id || '');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const selectedGecko = geckos.find(g => g.id === currentId) || geckos[0];

  if (!selectedGecko) {
    return <div style={{ color: '#94a3b8', padding: '2rem' }}>Nincs megjeleníthető gekkó az adatbázisban.</div>;
  }

  // Lookup Father & Mother
  const father = selectedGecko.fatherId ? geckos.find(g => g.id === selectedGecko.fatherId) : null;
  const mother = selectedGecko.motherId ? geckos.find(g => g.id === selectedGecko.motherId) : null;

  // Lookup Grandparents
  const paternalGrandFather = father?.fatherId ? geckos.find(g => g.id === father.fatherId) : null;
  const paternalGrandMother = father?.motherId ? geckos.find(g => g.id === father.motherId) : null;

  const maternalGrandFather = mother?.fatherId ? geckos.find(g => g.id === mother.fatherId) : null;
  const maternalGrandMother = mother?.motherId ? geckos.find(g => g.id === mother.motherId) : null;

  // Offspring
  const offspring = geckos.filter(g => g.fatherId === selectedGecko.id || g.motherId === selectedGecko.id);

  // Inbreeding check (if father and mother share parents)
  const isRelatedPairing = father && mother && (
    (father.fatherId && father.fatherId === mother.fatherId) ||
    (father.motherId && father.motherId === mother.motherId)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Selector */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <GitFork color="#10b981" size={26} />
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc' }}>
                Családfa & Pedigré Nyomonkövetés
              </h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Vizsgáld meg a felmenők és utódok genetikai vonalát, ellenőrizd a beltenyészést, és generálj hivatalos pedigré kártyát.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Gecko Picker */}
            <div className="form-group" style={{ margin: 0, minWidth: 260 }}>
              <select 
                className="form-select" 
                value={currentId} 
                onChange={e => {
                  setCurrentId(e.target.value);
                  setSelectedGeckoId(e.target.value);
                }}
              >
                {geckos.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.code}) — {g.morph}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setShowCertificateModal(true)}
              className="btn btn-primary"
            >
              <Award size={16} /> Pedigré Igazolás Generálása
            </button>
          </div>
        </div>
      </div>

      {/* Inbreeding Warning */}
      {isRelatedPairing && (
        <div className="glass-card" style={{
          padding: '1.25rem',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <ShieldAlert size={28} color="#fbbf24" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ color: '#fbbf24', fontSize: '1rem', fontWeight: 700 }}>
              ⚠️ BELTENYÉSZTÉSI VETÜLET ÉSZLELVE (Inbreeding / Coancestry Alert)
            </h4>
            <p style={{ color: '#fef3c7', fontSize: '0.85rem' }}>
              Ez a gekkó közös felmenőkkel rendelkező apától és anyától származik! A beltenyésztettség növeli az örökletes genetikai betegségek és deformitások kockázatát.
            </p>
          </div>
        </div>
      )}

      {/* Visual Family Tree Diagram */}
      <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '2rem', textAlign: 'center' }}>
          🌳 Generációs Családfa Diagram ({selectedGecko.name})
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem',
          minWidth: 850
        }}>
          {/* LEVEL 3: GRANDPARENTS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', width: '100%' }}>
            <NodeCard title="PATERNAL GRANDFATHER (APA APA)" gecko={paternalGrandFather} fallbackName="Ismeretlen Hím" color="#38bdf8" />
            <NodeCard title="PATERNAL GRANDMOTHER (APA ANYA)" gecko={paternalGrandMother} fallbackName="Ismeretlen Nőstény" color="#fb7185" />
            <NodeCard title="MATERNAL GRANDFATHER (ANYA APA)" gecko={maternalGrandFather} fallbackName="Ismeretlen Hím" color="#38bdf8" />
            <NodeCard title="MATERNAL GRANDMOTHER (ANYA ANYA)" gecko={maternalGrandMother} fallbackName="Ismeretlen Nőstény" color="#fb7185" />
          </div>

          {/* Connection Lines */}
          <div style={{ width: '100%', height: 2, background: 'rgba(255, 255, 255, 0.1)' }} />

          {/* LEVEL 2: PARENTS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem', width: '80%' }}>
            <NodeCard 
              title="♂ APA (FATHER)" 
              gecko={father} 
              fallbackName={selectedGecko.fatherName || 'Ismeretlen Apa'} 
              color="#38bdf8"
              onClick={() => father && setCurrentId(father.id)}
            />
            <NodeCard 
              title="♀ ANYA (MOTHER)" 
              gecko={mother} 
              fallbackName={selectedGecko.motherName || 'Ismeretlen Anya'} 
              color="#fb7185"
              onClick={() => mother && setCurrentId(mother.id)}
            />
          </div>

          {/* Connection Lines */}
          <div style={{ width: 2, height: 30, background: '#10b981' }} />

          {/* LEVEL 1: SELECTED GECKO */}
          <div style={{ width: '60%' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)',
              border: '2px solid #10b981',
              borderRadius: 16,
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
            }}>
              <span className="badge" style={{ background: '#10b981', color: '#fff', marginBottom: '0.5rem' }}>
                KIVÁLASZTOTT ÁLLAT
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{selectedGecko.name}</h3>
              <p style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 700 }}>{selectedGecko.morph}</p>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.3rem' }}>
                ID: {selectedGecko.code} • Kikelés: {selectedGecko.hatchDate || 'N/A'} • Súly: {selectedGecko.weightGrams ? `${selectedGecko.weightGrams}g` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Offspring List Section */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
          🐣 Utódok Listája ({offspring.length} db bébi rögzítve)
        </h3>

        {offspring.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Ennek a gekkónak még nincsenek rögzített utódai az adatbázisban.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {offspring.map(child => (
              <div 
                key={child.id}
                onClick={() => setCurrentId(child.id)}
                className="glass-card glass-card-interactive"
                style={{ padding: '1rem', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ color: '#f8fafc', fontSize: '0.95rem' }}>{child.name}</strong>
                  <span className={`badge badge-gender-${child.gender}`}>
                    {child.gender === 'male' ? '♂' : child.gender === 'female' ? '♀' : '❓'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>{child.morph}</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem' }}>{child.code}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pedigree Certificate Modal */}
      {showCertificateModal && (
        <div className="modal-overlay" onClick={() => setShowCertificateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 750 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award color="#fbbf24" size={22} /> HIVATALOS TENYÉSZTŐI PEDIGRÉ IGAZOLÁS
              </h3>
              <button onClick={() => setShowCertificateModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <div className="modal-body" style={{ background: '#ffffff', color: '#0f172a', padding: '2.5rem', borderRadius: 8 }}>
              {/* Certificate Design */}
              <div style={{ border: '4px double #0f172a', padding: '2rem', borderRadius: 6, textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>
                  CERTIFICATE OF PEDIGREE
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  Official Lineage & Genetic Proof — Crested Gecko Breeding System
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textTransform: 'none', textAlign: 'left', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: 6 }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Gekkó Neve:</p>
                    <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{selectedGecko.name}</strong>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Tenyészazonosító (ID):</p>
                    <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{selectedGecko.code}</strong>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Fenotípus / Morph:</p>
                    <strong style={{ fontSize: '1rem', color: '#059669' }}>{selectedGecko.morph}</strong>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Születési dátum:</p>
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{selectedGecko.hatchDate || 'Ismeretlen'}</strong>
                  </div>
                </div>

                {/* Lineage Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  <thead>
                    <tr style={{ background: '#e2e8f0', color: '#0f172a' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #cbd5e1' }}>Felmenő</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #cbd5e1' }}>Név / ID</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #cbd5e1' }}>Morph</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}><strong>Apa (Sire)</strong></td>
                      <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>{father?.name || selectedGecko.fatherName || 'Ismeretlen'}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>{father?.morph || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}><strong>Anya (Dam)</strong></td>
                      <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>{mother?.name || selectedGecko.motherName || 'Ismeretlen'}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>{mother?.morph || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1' }}>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Eredeti Tenyésztő:</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{selectedGecko.breederName || 'Saját Tenyészet'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Kiállítás dátuma:</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{new Date().toLocaleDateString('hu-HU')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => window.print()} className="btn btn-primary">
                <Printer size={16} /> Nyomtatás / Mentés PDF-be
              </button>
              <button onClick={() => setShowCertificateModal(false)} className="btn btn-secondary">Bezárás</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper card component for Family Tree nodes
const NodeCard: React.FC<{
  title: string;
  gecko?: Gecko | null;
  fallbackName: string;
  color: string;
  onClick?: () => void;
}> = ({ title, gecko, fallbackName, color, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: `1px solid ${gecko ? color : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: 12,
        padding: '0.85rem',
        cursor: gecko && onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease'
      }}
    >
      <span style={{ fontSize: '0.7rem', fontWeight: 700, color, display: 'block', marginBottom: '0.2rem' }}>
        {title}
      </span>
      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: gecko ? '#f8fafc' : '#94a3b8' }}>
        {gecko ? gecko.name : fallbackName}
      </h4>
      <p style={{ fontSize: '0.75rem', color: gecko ? '#10b981' : '#64748b', fontWeight: 600 }}>
        {gecko ? gecko.morph : 'Nincs genetikai adat'}
      </p>
    </div>
  );
};
