import React from 'react';
import { useGeckoContext } from '../context/GeckoContext';
import { 
  LayoutDashboard, 
  Dna, 
  GitFork, 
  Egg, 
  Database, 
  PlusCircle, 
  ShieldCheck, 
  HardDrive
} from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const { activeTab, setActiveTab, geckos, clutches, isConnectedToSupabase } = useGeckoContext();

  const totalGeckos = geckos.length;
  const breedersCount = geckos.filter(g => g.status === 'breeder').length;
  const activeClutchesCount = clutches.filter(c => c.status === 'incubating').length;
  const forSaleCount = geckos.filter(g => g.status === 'for_sale').length;

  return (
    <header style={{
      background: 'rgba(11, 15, 23, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Dna size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>
              GeckoGenetics<span style={{ color: '#10b981' }}>Hub</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Vitorlás Gekkó Tenyészet Adatbázis</p>
          </div>

          {/* Connection status badge */}
          <div 
            onClick={() => setActiveTab('supabase')}
            style={{
              cursor: 'pointer',
              marginLeft: '0.75rem',
              padding: '0.3rem 0.65rem',
              borderRadius: 20,
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: isConnectedToSupabase ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isConnectedToSupabase ? '#34d399' : '#fbbf24',
              border: `1px solid ${isConnectedToSupabase ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
            }}
            title="Kattints a Supabase kapcsolat és SQL beállításokhoz"
          >
            {isConnectedToSupabase ? <ShieldCheck size={14} /> : <HardDrive size={14} />}
            {isConnectedToSupabase ? 'Supabase Cloud Synced' : 'Helyi Tárhely (Demo)'}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            <LayoutDashboard size={16} /> Áttekintés
          </button>

          <button
            onClick={() => setActiveTab('geckos')}
            className={`btn ${activeTab === 'geckos' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            <Database size={16} /> Gekkó Adatbázis ({totalGeckos})
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`btn ${activeTab === 'calculator' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            <Dna size={16} /> Morph Kalkulátor
          </button>

          <button
            onClick={() => setActiveTab('lineage')}
            className={`btn ${activeTab === 'lineage' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            <GitFork size={16} /> Családfa
          </button>

          <button
            onClick={() => setActiveTab('clutches')}
            className={`btn ${activeTab === 'clutches' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
          >
            <Egg size={16} /> Fészekaljak ({activeClutchesCount})
          </button>
        </nav>

        {/* Quick Add Button */}
        <div>
          <button
            onClick={onOpenAddModal}
            className="btn btn-primary"
            style={{
              fontSize: '0.85rem',
              padding: '0.55rem 1.1rem',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
            }}
          >
            <PlusCircle size={18} /> Új Gekkó Hozzáadása
          </button>
        </div>
      </div>

      {/* Quick KPI Strip */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        padding: '0.4rem 1.5rem',
        fontSize: '0.75rem',
        color: '#94a3b8',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        <span>🦎 Total Geckos: <strong style={{ color: '#f8fafc' }}>{totalGeckos}</strong></span>
        <span>👑 Tenyészállatok: <strong style={{ color: '#34d399' }}>{breedersCount}</strong></span>
        <span>🥚 Inkubátorban Tojások: <strong style={{ color: '#fbbf24' }}>{activeClutchesCount * 2} db</strong></span>
        <span>💰 Eladó Bébik: <strong style={{ color: '#38bdf8' }}>{forSaleCount} db</strong></span>
      </div>
    </header>
  );
};
