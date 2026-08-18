import React, { useState } from 'react';
import { useGeckoContext } from '../context/GeckoContext';
import { 
  Egg, 
  Plus, 
  Thermometer, 
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ClutchesView: React.FC = () => {
  const { clutches, geckos, addClutch, updateClutch } = useGeckoContext();

  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const femaleBreeders = geckos.filter(g => g.gender === 'female');
  const maleBreeders = geckos.filter(g => g.gender === 'male');

  const [fatherId, setFatherId] = useState<string>(maleBreeders[0]?.id || '');
  const [motherId, setMotherId] = useState<string>(femaleBreeders[0]?.id || '');
  const [laidDate, setLaidDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [eggCount, setEggCount] = useState<number>(2);
  const [fertileCount, setFertileCount] = useState<number>(2);
  const [incubationTempC, setIncubationTempC] = useState<number>(23.5);
  const [notes, setNotes] = useState<string>('');

  const handleCreateClutch = () => {
    // Calculate expected hatch date (~65 days at 23.5C)
    const laid = new Date(laidDate);
    laid.setDate(laid.getDate() + 65);
    const expectedHatchDate = laid.toISOString().split('T')[0];

    const fatherObj = geckos.find(g => g.id === fatherId);
    const motherObj = geckos.find(g => g.id === motherId);

    addClutch({
      fatherId,
      motherId,
      fatherName: fatherObj?.name || 'Ismeretlen Apa',
      motherName: motherObj?.name || 'Ismeretlen Anya',
      laidDate,
      eggCount,
      fertileCount,
      incubationTempC,
      expectedHatchDate,
      status: 'incubating',
      notes
    });

    setShowAddModal(false);
  };

  const handleMarkHatched = (clutchId: string) => {
    updateClutch(clutchId, { status: 'hatched' });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Egg color="#fbbf24" size={28} />
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc' }}>
                Fészekalj & Inkubációs Napló
              </h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Rögzítsd a lerakott tojásokat, kövesd az inkubációs hőmérsékletet és tartsd számon a várható kikelési dátumokat!
            </p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus size={18} /> Új Fészekalj Rögzítése
          </button>
        </div>
      </div>

      {/* Active Incubating Clutches */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock color="#fbbf24" size={22} /> Inkubátorban Lévő Tojások ({clutches.filter(c => c.status === 'incubating').length} fészekalj)
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {clutches.map(clutch => (
            <div key={clutch.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span className="badge" style={{
                    background: clutch.status === 'incubating' ? 'rgba(245, 158, 11, 0.15)' : clutch.status === 'hatched' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    color: clutch.status === 'incubating' ? '#fbbf24' : clutch.status === 'hatched' ? '#34d399' : '#f43f5e',
                    border: `1px solid ${clutch.status === 'incubating' ? 'rgba(245, 158, 11, 0.3)' : clutch.status === 'hatched' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
                  }}>
                    {clutch.status === 'incubating' ? '🥚 Inkubálódik' : clutch.status === 'hatched' ? '🎉 Kikelt!' : '❌ Tönkrement'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    <Thermometer size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {clutch.incubationTempC} °C
                  </span>
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  ♀ {clutch.motherName} × ♂ {clutch.fatherName}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  <span>Tojásrakás dátuma: <strong style={{ color: '#f8fafc' }}>{clutch.laidDate}</strong></span>
                  <span>Összes tojás: <strong style={{ color: '#f8fafc' }}>{clutch.eggCount} db</strong> (Termékeny: {clutch.fertileCount} db)</span>
                  <span>Várható kikelés: <strong style={{ color: '#38bdf8' }}>{clutch.expectedHatchDate}</strong></span>
                </div>

                {clutch.notes && (
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: 8, marginBottom: '1rem' }}>
                    📝 {clutch.notes}
                  </p>
                )}
              </div>

              {/* Action Button */}
              {clutch.status === 'incubating' && (
                <button 
                  onClick={() => handleMarkHatched(clutch.id)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <Sparkles size={16} /> Megjelölés Kikeltként 🎉
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Clutch Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Egg color="#fbbf24" size={20} /> Új Fészekalj Rögzítése
              </h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">♀ ANYA (Nőstény):</label>
                <select className="form-select" value={motherId} onChange={e => setMotherId(e.target.value)}>
                  {femaleBreeders.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.morph})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">♂ APA (Hím):</label>
                <select className="form-select" value={fatherId} onChange={e => setFatherId(e.target.value)}>
                  {maleBreeders.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.morph})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tojásrakási Dátum:</label>
                  <input type="date" className="form-input" value={laidDate} onChange={e => setLaidDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Inkubációs Hőmérséklet (°C):</label>
                  <input type="number" step="0.1" className="form-input" value={incubationTempC} onChange={e => setIncubationTempC(parseFloat(e.target.value))} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tojások Száma:</label>
                  <input type="number" className="form-input" value={eggCount} onChange={e => setEggCount(parseInt(e.target.value))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Termékeny Tojások Száma:</label>
                  <input type="number" className="form-input" value={fertileCount} onChange={e => setFertileCount(parseInt(e.target.value))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Megjegyzések (pl. lámpázási tapasztalatok):</label>
                <textarea className="form-textarea" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Tetszőleges megjegyzések..." />
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handleCreateClutch} className="btn btn-primary">Mentés az Inkubátorba</button>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary">Mégse</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
