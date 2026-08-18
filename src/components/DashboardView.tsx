import React, { useState } from 'react';
import { useGeckoContext } from '../context/GeckoContext';
import { calculateMorphOutcomes } from '../utils/genetics';
import { getGeckoImage } from '../utils/imageHelper';
import { 
  Sparkles, 
  Dna, 
  Egg, 
  ArrowRight,
  ShieldAlert,
  Flame,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';


export const DashboardView: React.FC = () => {
  const { geckos, clutches, setActiveTab, setSelectedGeckoId } = useGeckoContext();

  const breeders = geckos.filter(g => g.status === 'breeder');
  const forSale = geckos.filter(g => g.status === 'for_sale');
  const activeClutches = clutches.filter(c => c.status === 'incubating');

  // Quick Morph calculator preview state
  const maleBreeders = breeders.filter(g => g.gender === 'male');
  const femaleBreeders = breeders.filter(g => g.gender === 'female');

  const [selectedMaleId, setSelectedMaleId] = useState<string>(maleBreeders[0]?.id || '');
  const [selectedFemaleId, setSelectedFemaleId] = useState<string>(femaleBreeders[0]?.id || '');

  // Collapsible panels state (default collapsed: false)
  const [isPairingExpanded, setIsPairingExpanded] = useState<boolean>(false);
  const [isIncubationExpanded, setIsIncubationExpanded] = useState<boolean>(false);

  const maleGecko = geckos.find(g => g.id === selectedMaleId);
  const femaleGecko = geckos.find(g => g.id === selectedFemaleId);

  const outcomes = (maleGecko && femaleGecko)
    ? calculateMorphOutcomes(maleGecko.genetics, femaleGecko.genetics)
    : [];

  const hasLethalWarning = outcomes.some(o => o.isLethalWarning);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Welcome Banner */}
      <div className="glass-card" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(139, 92, 246, 0.05) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: 20,
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#34d399',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.85rem'
          }}>
            <Sparkles size={14} /> Prémium Tenyésztői Irányítópult
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Üdvözöl a Vitorlás Gekkó Tenyészetedben! 🦎
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Kezeld könnyedén a gekkóid származását, kövesd nyomon a tojások inkubációját és súlyfejlődését,
            valamint használd a beépített genetikai kalkulátort a kikelendő bébik morphjainak tervezéséhez.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('calculator')} 
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
          >
            <Dna size={18} /> Morph Kalkulátor
          </button>
          <button 
            onClick={() => setActiveTab('geckos')} 
            className="btn btn-secondary"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
          >
            Összes Állat ({geckos.length})
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Total Geckos */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>TENYÉSZET MÉRETE</span>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>{geckos.length} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>gekkó</span></div>
          <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '0.4rem' }}>{breeders.length} aktív tenyészállat</div>
        </div>

        {/* Incubation Clutches */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>INKUBÁTORBAN</span>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Egg size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>{activeClutches.length * 2} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>tojás</span></div>
          <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '0.4rem' }}>{activeClutches.length} fészekalj gondozása</div>
        </div>

        {/* For Sale */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>ELADÓ BÉBİK</span>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>{forSale.length} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>db</span></div>
          <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '0.4rem' }}>Kész a gazdisodásra</div>
        </div>

        {/* Rare Gene Index */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>RITKA GÉNEK</span>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dna size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
            {geckos.filter(g => g.genetics.lillyWhite).length} Lilly White, {geckos.filter(g => g.genetics.axanthic !== 'none').length} Axanthic
          </div>
          <div style={{ fontSize: '0.8rem', color: '#c084fc', marginTop: '0.4rem' }}>Vizuális & Het hordozók</div>
        </div>
      </div>

      {/* Main Grid: Quick Morph Calculator + Upcoming Hatchings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Quick Pair Morph Simulator */}
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', alignSelf: 'start', transition: 'all 0.3s ease' }}>
          <div 
            onClick={() => setIsPairingExpanded(prev => !prev)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Dna color="#10b981" size={22} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Gyors Párzási Szimulátor
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveTab('calculator'); }}
                className="btn btn-secondary btn-sm"
              >
                Részletes kalkulátor <ArrowRight size={14} />
              </button>
              <div 
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease',
                  transform: isPairingExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <ChevronDown size={18} color="#94a3b8" />
              </div>
            </div>
          </div>

          {/* Collapsible Body */}
          {isPairingExpanded && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                {/* Male selector */}
                <div className="form-group">
                  <label className="form-label" style={{ color: '#38bdf8' }}>♂ APA (Hím tenyészállat)</label>
                  <select 
                    className="form-select"
                    value={selectedMaleId}
                    onChange={e => setSelectedMaleId(e.target.value)}
                  >
                    {maleBreeders.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.morph})</option>
                    ))}
                  </select>
                </div>

                {/* Female selector */}
                <div className="form-group">
                  <label className="form-label" style={{ color: '#fb7185' }}>♀ ANYA (Nőstény tenyészállat)</label>
                  <select 
                    className="form-select"
                    value={selectedFemaleId}
                    onChange={e => setSelectedFemaleId(e.target.value)}
                  >
                    {femaleBreeders.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.morph})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lethal Warning Alert */}
              {hasLethalWarning && (
                <div style={{
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  borderRadius: 10,
                  padding: '0.85rem 1rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#fecdd3'
                }}>
                  <ShieldAlert size={24} color="#f43f5e" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.825rem' }}>
                    <strong style={{ color: '#f43f5e', display: 'block' }}>⚠️ FIGYELEM: LETÁLIS LILLY WHITE PÁROSÍTÁS!</strong>
                    Mindkét szülő Lilly White. A várt utódok 25%-a homozigóta Letális Super Lilly lesz!
                  </div>
                </div>
              )}

              {/* Probability Outcomes List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  VÁRHATÓ UTÓD MORPHOK SZÁZALÉKOSAN:
                </span>

                {outcomes.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Válassz ki egy apát és egy anyát a párosítás modellezéséhez.</p>
                ) : (
                  outcomes.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: item.isLethalWarning ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${item.isLethalWarning ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
                        borderRadius: 8,
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} color={item.isRareCombination ? '#c084fc' : '#10b981'} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: item.isLethalWarning ? '#f43f5e' : '#f8fafc' }}>
                          {item.morphName}
                        </span>
                      </div>
                      <span style={{
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        color: item.isLethalWarning ? '#f43f5e' : '#34d399',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 6
                      }}>
                        {item.probabilityPercent}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Active Incubating Clutches */}
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', alignSelf: 'start', transition: 'all 0.3s ease' }}>
          <div 
            onClick={() => setIsIncubationExpanded(prev => !prev)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Egg color="#fbbf24" size={22} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Inkubációs Visszaszámláló
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveTab('clutches'); }}
                className="btn btn-secondary btn-sm"
              >
                Fészekalj napló <ArrowRight size={14} />
              </button>
              <div 
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease',
                  transform: isIncubationExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <ChevronDown size={18} color="#94a3b8" />
              </div>
            </div>
          </div>

          {/* Collapsible Body */}
          {isIncubationExpanded && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeClutches.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Jelenleg nincs aktív tojás az inkubátorban.</p>
                ) : (
                  activeClutches.map(c => (
                    <div 
                      key={c.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        borderRadius: 12,
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                          🥚 {c.motherName || 'Nőstény'} × {c.fatherName || 'Hím'}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#fbbf24',
                          background: 'rgba(245, 158, 11, 0.15)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 12
                        }}>
                          {c.eggCount} db tojás ({c.incubationTempC} °C)
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '1rem' }}>
                        <span>Tojásrakás: {c.laidDate}</span>
                        <span>Várható kikelés: <strong style={{ color: '#38bdf8' }}>{c.expectedHatchDate}</strong></span>
                      </div>

                      <div style={{
                        width: '100%',
                        height: 6,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        marginTop: '0.4rem',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: '75%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #f59e0b, #10b981)',
                          borderRadius: 3
                        }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Breeders Showcase */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
            👑 Tenyészállatok Galériája
          </h3>
          <button onClick={() => setActiveTab('geckos')} className="btn btn-secondary btn-sm">
            Összes Gekkó Megtekintése
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {breeders.slice(0, 4).map(gecko => (
            <div 
              key={gecko.id}
              className="glass-card glass-card-interactive"
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => {
                setSelectedGeckoId(gecko.id);
                setActiveTab('geckos');
              }}
            >
              <div style={{ aspectRatio: '4 / 3', width: '100%', position: 'relative', overflow: 'hidden', background: '#0b0f17' }}>
                {/* Ambient Blurred Background for rich color fill */}
                <img 
                  src={getGeckoImage(gecko)} 
                  alt="" 
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'blur(18px) brightness(0.45)',
                    transform: 'scale(1.2)'
                  }} 
                />

                {/* Foreground Image - 100% Unclipped Full Gecko View */}
                <img 
                  src={getGeckoImage(gecko)} 
                  alt={gecko.name}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    zIndex: 1
                  }}
                />

                {/* Top Vignette Gradient */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 50,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
                  zIndex: 2,
                  pointerEvents: 'none'
                }} />

                <span className={`badge badge-gender-${gecko.gender}`} style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}>
                  {gecko.gender === 'male' ? '♂ Hím' : gecko.gender === 'female' ? '♀ Nőstény' : '❓ Unsexed'}
                </span>
                <span style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  zIndex: 3,
                  background: 'rgba(0,0,0,0.75)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#34d399',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {gecko.code}
                </span>
              </div>


              <div style={{ padding: '1.15rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.3rem' }}>
                  {gecko.name}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {gecko.morph}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <span>Súly: <strong style={{ color: '#f8fafc' }}>{gecko.weightGrams ? `${gecko.weightGrams}g` : 'N/A'}</strong></span>
                  <span>Tenyésztő: <strong style={{ color: '#f8fafc' }}>{gecko.breederName || 'Saját'}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
