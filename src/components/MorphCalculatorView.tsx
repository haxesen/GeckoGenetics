import React, { useState } from 'react';
import { useGeckoContext } from '../context/GeckoContext';
import type { GeckoGenetics } from '../types/gecko';
import { DEFAULT_GENETICS, calculateMorphOutcomes, buildMorphString } from '../utils/genetics';
import { 
  Dna, 
  ShieldAlert, 
  Sparkles, 
  Percent
} from 'lucide-react';

export const MorphCalculatorView: React.FC = () => {
  const { geckos } = useGeckoContext();

  const [mode, setMode] = useState<'db' | 'custom'>('db');

  // DB selection mode
  const maleList = geckos.filter(g => g.gender === 'male');
  const femaleList = geckos.filter(g => g.gender === 'female');

  const [p1Id, setP1Id] = useState<string>(maleList[0]?.id || geckos[0]?.id || '');
  const [p2Id, setP2Id] = useState<string>(femaleList[0]?.id || geckos[1]?.id || '');

  // Custom mode genetics state
  const [customP1, setCustomP1] = useState<GeckoGenetics>({
    ...DEFAULT_GENETICS,
    lillyWhite: true,
    axanthic: 'het'
  });

  const [customP2, setCustomP2] = useState<GeckoGenetics>({
    ...DEFAULT_GENETICS,
    axanthic: 'visual'
  });

  const p1Genetics = mode === 'db' 
    ? (geckos.find(g => g.id === p1Id)?.genetics || DEFAULT_GENETICS)
    : customP1;

  const p2Genetics = mode === 'db'
    ? (geckos.find(g => g.id === p2Id)?.genetics || DEFAULT_GENETICS)
    : customP2;

  const p1MorphName = mode === 'db'
    ? (geckos.find(g => g.id === p1Id)?.morph || 'N/A')
    : buildMorphString(customP1);

  const p2MorphName = mode === 'db'
    ? (geckos.find(g => g.id === p2Id)?.morph || 'N/A')
    : buildMorphString(customP2);

  const outcomes = calculateMorphOutcomes(p1Genetics, p2Genetics);
  const hasLethalWarning = outcomes.some(o => o.isLethalWarning);

  const updateGenetics = (
    parentSetter: React.Dispatch<React.SetStateAction<GeckoGenetics>>,
    field: keyof GeckoGenetics,
    value: any
  ) => {
    parentSetter(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Dna color="#10b981" size={28} />
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc' }}>
                Genetikai & Morph Kalkulátor
              </h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Válassz ki két tenyészállatot az adatbázisból, vagy konfigurálj egyedi szülői morphokat az utódok várható arányainak szimulálásához!
            </p>
          </div>

          {/* Mode Switcher */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '0.3rem',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            gap: '0.3rem'
          }}>
            <button
              onClick={() => setMode('db')}
              className={`btn btn-sm ${mode === 'db' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              Adatbázis Állatokból
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`btn btn-sm ${mode === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              Egyedi Morph Szimulátor
            </button>
          </div>
        </div>
      </div>

      {/* Parents Selection Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Parent 1 (Male / Father) */}
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #38bdf8' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ♂ APA (SZÜLŐ 1)
          </h3>

          {mode === 'db' ? (
            <div className="form-group">
              <label className="form-label">Válassz apát az adatbázisból:</label>
              <select className="form-select" value={p1Id} onChange={e => setP1Id(e.target.value)}>
                {geckos.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.gender === 'male' ? '♂' : g.gender === 'female' ? '♀' : '❓'} {g.name} — {g.morph}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <GeneticsEditor formGenetics={customP1} onChange={(field, val) => updateGenetics(setCustomP1, field, val)} />
          )}

          <div style={{
            marginTop: '1rem',
            padding: '0.85rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>KIVÁLASZTOTT MORPH:</span>
            <strong style={{ color: '#38bdf8', fontSize: '0.95rem' }}>{p1MorphName}</strong>
          </div>
        </div>

        {/* Parent 2 (Female / Mother) */}
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #fb7185' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fb7185', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ♀ ANYA (SZÜLŐ 2)
          </h3>

          {mode === 'db' ? (
            <div className="form-group">
              <label className="form-label">Válassz anyát az adatbázisból:</label>
              <select className="form-select" value={p2Id} onChange={e => setP2Id(e.target.value)}>
                {geckos.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.gender === 'female' ? '♀' : g.gender === 'male' ? '♂' : '❓'} {g.name} — {g.morph}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <GeneticsEditor formGenetics={customP2} onChange={(field, val) => updateGenetics(setCustomP2, field, val)} />
          )}

          <div style={{
            marginTop: '1rem',
            padding: '0.85rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>KIVÁLASZTOTT MORPH:</span>
            <strong style={{ color: '#fb7185', fontSize: '0.95rem' }}>{p2MorphName}</strong>
          </div>
        </div>
      </div>

      {/* Lethal Warning Box */}
      {hasLethalWarning && (
        <div className="glass-card" style={{
          padding: '1.5rem',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.5)',
          boxShadow: '0 0 30px rgba(244, 63, 94, 0.25)',
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'flex-start'
        }}>
          <ShieldAlert size={36} color="#f43f5e" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f43f5e', marginBottom: '0.35rem' }}>
              ⚠️ FIGYELMEZTETÉS: VESZÉLYES / LETÁLIS HOMOZIGÓTA PÁROSÍTÁS!
            </h3>
            <p style={{ color: '#fecdd3', fontSize: '0.9rem', lineHeight: 1.5 }}>
              A két kiválasztott szülő mindegyike hordozza a domináns <strong>Lilly White</strong> gént! A Lilly White x Lilly White párosítás a tojások 25%-ában <strong>Super Lilly (LW/LW)</strong> kombinációt eredményez, ami letális (a bébi nem marad életben a kikelés után). Ennek a párosításnak a megvalósítása tenyésztési szempontból szigorúan elkerülendő!
            </p>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Percent color="#34d399" size={24} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
              Számított Utód Százalékos Arányok
            </h3>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {outcomes.length} lehetséges fenotípus kombináció
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {outcomes.map((outcome, idx) => (
            <div
              key={idx}
              style={{
                background: outcome.isLethalWarning 
                  ? 'rgba(244, 63, 94, 0.12)' 
                  : outcome.isRareCombination 
                  ? 'rgba(139, 92, 246, 0.12)' 
                  : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${
                  outcome.isLethalWarning 
                    ? 'rgba(244, 63, 94, 0.4)' 
                    : outcome.isRareCombination 
                    ? 'rgba(139, 92, 246, 0.4)' 
                    : 'rgba(255, 255, 255, 0.08)'
                }`,
                borderRadius: 12,
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  {outcome.isRareCombination && (
                    <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.25)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                      <Sparkles size={12} /> Ritka kombináció
                    </span>
                  )}
                  {outcome.isLethalWarning && (
                    <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.25)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
                      ⚠️ LETÁLIS
                    </span>
                  )}
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: outcome.isLethalWarning ? '#f43f5e' : '#f8fafc' }}>
                    {outcome.morphName}
                  </h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  {outcome.genotypeDescription}
                </p>
              </div>

              {/* Progress Bar & Percentage */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: 200 }}>
                <div style={{ flex: 1, height: 10, background: 'rgba(0,0,0,0.4)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{
                    width: `${outcome.probabilityPercent}%`,
                    height: '100%',
                    background: outcome.isLethalWarning 
                      ? '#f43f5e' 
                      : outcome.isRareCombination 
                      ? 'linear-gradient(90deg, #8b5cf6, #c084fc)' 
                      : 'linear-gradient(90deg, #10b981, #34d399)',
                    borderRadius: 5
                  }} />
                </div>

                <div style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: outcome.isLethalWarning ? '#f43f5e' : outcome.isRareCombination ? '#c084fc' : '#34d399',
                  minWidth: 65,
                  textAlign: 'right'
                }}>
                  {outcome.probabilityPercent}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper component to edit genetics flags in custom mode
const GeneticsEditor: React.FC<{
  formGenetics: GeckoGenetics;
  onChange: (field: keyof GeckoGenetics, value: any) => void;
}> = ({ formGenetics, onChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Lilly White */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="form-label" style={{ margin: 0 }}>Lilly White (Co-dominant):</label>
        <input 
          type="checkbox"
          checked={formGenetics.lillyWhite}
          onChange={e => onChange('lillyWhite', e.target.checked)}
          style={{ width: 18, height: 18, accentColor: '#10b981', cursor: 'pointer' }}
        />
      </div>

      {/* Axanthic */}
      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label">Axanthic (Recesszív):</label>
        <select className="form-select" value={formGenetics.axanthic} onChange={e => onChange('axanthic', e.target.value)}>
          <option value="none">Nem hordozza (None)</option>
          <option value="het">100% Het Axanthic (Hordozó)</option>
          <option value="visual">Visual Axanthic (Vizuális ax/ax)</option>
        </select>
      </div>

      {/* Cappuccino */}
      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label">Cappuccino (Co-dominant):</label>
        <select className="form-select" value={formGenetics.cappuccino} onChange={e => onChange('cappuccino', e.target.value)}>
          <option value="none">Nincs</option>
          <option value="visual">Cappuccino (Vizuális)</option>
          <option value="super">Super Cappuccino (Translucent)</option>
        </select>
      </div>

      {/* Pattern */}
      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label">Alap Mintázat:</label>
        <select className="form-select" value={formGenetics.pattern} onChange={e => onChange('pattern', e.target.value)}>
          <option value="patternless">Patternless (Mintátlan)</option>
          <option value="bicolor">Bicolor</option>
          <option value="flame">Flame</option>
          <option value="harlequin">Harlequin</option>
          <option value="extreme_harlequin">Extreme Harlequin</option>
          <option value="tricolor">Tricolor</option>
        </select>
      </div>

      {/* Pinstripe */}
      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label">Pinstripe / Háti csíkozás:</label>
        <select className="form-select" value={formGenetics.pinstripe} onChange={e => onChange('pinstripe', e.target.value)}>
          <option value="none">Nincs</option>
          <option value="partial">Partial Pinstripe</option>
          <option value="full">Full Pinstripe (100%)</option>
          <option value="quadstripe">Quadstripe (Háti + oldal)</option>
        </select>
      </div>
    </div>
  );
};
