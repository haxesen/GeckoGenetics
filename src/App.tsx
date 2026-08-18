import React, { useState } from 'react';
import { GeckoProvider, useGeckoContext } from './context/GeckoContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { GeckoListView } from './components/GeckoListView';
import { MorphCalculatorView } from './components/MorphCalculatorView';
import { LineageView } from './components/LineageView';
import { ClutchesView } from './components/ClutchesView';
import { SupabaseSetupView } from './components/SupabaseSetupView';
import { AddGeckoModal } from './components/AddGeckoModal';

const MainAppContent: React.FC = () => {
  const { activeTab, loading } = useGeckoContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#10b981',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '1.25rem'
      }}>
        🦎 Adatbázis és Genetikai Törzskönyv Betöltése...
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      <main className="main-content">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'geckos' && <GeckoListView onOpenAddModal={() => setIsAddModalOpen(true)} />}
        {activeTab === 'calculator' && <MorphCalculatorView />}
        {activeTab === 'lineage' && <LineageView />}
        {activeTab === 'clutches' && <ClutchesView />}
        {activeTab === 'supabase' && <SupabaseSetupView />}
      </main>

      <AddGeckoModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#64748b',
        background: 'rgba(11, 15, 23, 0.9)'
      }}>
        GeckoGenetics Hub © {new Date().getFullYear()} — Vitorlás Gekkó Tenyészet Adatbázis & Supabase Integráció
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <GeckoProvider>
      <MainAppContent />
    </GeckoProvider>
  );
}
