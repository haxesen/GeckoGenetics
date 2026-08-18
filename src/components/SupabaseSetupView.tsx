import React, { useState } from 'react';
import { useGeckoContext } from '../context/GeckoContext';
import { SQL_SCHEMA_SCRIPT } from '../services/supabase';
import { 
  Database, 
  ShieldCheck, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  Code
} from 'lucide-react';

export const SupabaseSetupView: React.FC = () => {
  const { isConnectedToSupabase, resetToDefaultData } = useGeckoContext();
  const [copied, setCopied] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Database color="#38bdf8" size={28} />
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc' }}>
            Supabase Adatbázis Beállítások & SQL Séma
          </h2>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Az alkalmazás támogatja a felhőalapú valós idejű Supabase adatbázist, valamint az azonnali helyi demó módot is.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${isConnectedToSupabase ? '#10b981' : '#f59e0b'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: isConnectedToSupabase ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isConnectedToSupabase ? '#34d399' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isConnectedToSupabase ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                {isConnectedToSupabase ? 'Kapcsolódva a Supabase Felhőhöz ⚡' : 'Helyi Demo Mód Aktív (LocalStorage)'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {isConnectedToSupabase 
                  ? 'A gekkóid, súlybejegyzéseid és fészekaljaid szinkronizálva vannak a Supabase adatbázisoddal.'
                  : 'A környezeti változók (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) hiányoznak. Az adatok jelenleg a böngésződ helyi tárhelyén mentődnek.'}
              </p>
            </div>
          </div>

          <button onClick={resetToDefaultData} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Demó Adatok Visszaállítása
          </button>
        </div>
      </div>

      {/* SQL Script Generator Box */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code color="#10b981" size={22} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
              Supabase PostgreSQL SQL Séma Kód
            </h3>
          </div>

          <button onClick={handleCopySql} className="btn btn-primary btn-sm">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Másolva a vágólapra!' : 'SQL Másolása 1-Kattintással'}
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
          Nyisd meg a Supabase Dashboard &rarr; <strong>SQL Editor</strong> menüpontját, illeszd be ezt a kódot, és kattints a <strong>Run</strong> gombra a táblák és házirendek automatikus létrehozásához:
        </p>

        <pre style={{
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 10,
          padding: '1.25rem',
          fontSize: '0.825rem',
          color: '#34d399',
          fontFamily: 'monospace',
          overflowX: 'auto',
          maxHeight: 350
        }}>
          {SQL_SCHEMA_SCRIPT}
        </pre>
      </div>

      {/* Instructions on adding .env.local */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.85rem' }}>
          🔧 Hogyan csatlakoztasd a Supabase-t? (.env.local összefoglaló)
        </h3>
        <ol style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.8 }}>
          <li>Hozz létre egy ingyenes projektet a <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>supabase.com</a> oldalon.</li>
          <li>Futtasd a fenti SQL kódot a Supabase SQL Editorában.</li>
          <li>Hozz létre egy <code style={{ color: '#34d399', background: 'rgba(0,0,0,0.4)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>.env.local</code> fájlt a projekt gyökérkönyvtárában a következő tartalommal:</li>
        </ol>

        <pre style={{
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 8,
          padding: '1rem',
          fontSize: '0.85rem',
          color: '#fbbf24',
          fontFamily: 'monospace',
          marginTop: '0.85rem'
        }}>
{`VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here`}
        </pre>
      </div>
    </div>
  );
};
