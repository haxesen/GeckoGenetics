import React, { useState } from 'react';
import { useGeckoContext } from '../context/GeckoContext';
import type { Gender, GeckoStatus, GeckoGenetics } from '../types/gecko';
import { DEFAULT_GENETICS, buildMorphString } from '../utils/genetics';
import { PlusCircle, Dna } from 'lucide-react';

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
  const [mainImageUrl, setMainImageUrl] = useState('');

  // Genetics flags
  const [genetics, setGenetics] = useState<GeckoGenetics>({ ...DEFAULT_GENETICS });

  if (!isOpen) return null;

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
      mainImageUrl: mainImageUrl.trim() || undefined
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

            {/* Image URL & Hatch Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Főkép URL (Kép hivatkozás)</label>
                <input type="url" className="form-input" placeholder="https://..." value={mainImageUrl} onChange={e => setMainImageUrl(e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Kikelési Dátum</label>
                <input type="date" className="form-input" value={hatchDate} onChange={e => setHatchDate(e.target.value)} />
              </div>
            </div>

            {/* Genetics Flags */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 10,
              padding: '1rem'
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Dna size={16} /> Genetikai Értékek & Morph Beállítása
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={genetics.lillyWhite} onChange={e => setGenetics({ ...genetics, lillyWhite: e.target.checked })} style={{ accentColor: '#10b981' }} />
                  <label className="form-label" style={{ margin: 0 }}>Lilly White (LW)</label>
                </div>

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
                  <label className="form-label">Mintázat:</label>
                  <select className="form-select" value={genetics.pattern} onChange={e => setGenetics({ ...genetics, pattern: e.target.value as any })}>
                    <option value="harlequin">Harlequin</option>
                    <option value="extreme_harlequin">Extreme Harlequin</option>
                    <option value="flame">Flame</option>
                    <option value="tricolor">Tricolor</option>
                    <option value="patternless">Patternless</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '0.85rem', fontSize: '0.825rem', color: '#94a3b8' }}>
                Számított Morph: <strong style={{ color: '#10b981' }}>{buildMorphString(genetics)}</strong>
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
