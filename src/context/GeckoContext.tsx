import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Gecko, WeightEntry, Clutch } from '../types/gecko';
import { INITIAL_GECKOS, INITIAL_WEIGHTS, INITIAL_CLUTCHES } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface GeckoContextType {
  geckos: Gecko[];
  weights: WeightEntry[];
  clutches: Clutch[];
  loading: boolean;
  activeTab: 'dashboard' | 'geckos' | 'calculator' | 'lineage' | 'clutches' | 'supabase';
  setActiveTab: (tab: 'dashboard' | 'geckos' | 'calculator' | 'lineage' | 'clutches' | 'supabase') => void;
  selectedGeckoId: string | null;
  setSelectedGeckoId: (id: string | null) => void;
  addGecko: (gecko: Omit<Gecko, 'id' | 'createdAt'>) => Promise<void>;
  updateGecko: (id: string, updates: Partial<Gecko>) => Promise<void>;
  deleteGecko: (id: string) => Promise<void>;
  addWeightLog: (geckoId: string, weightGrams: number, notes?: string) => Promise<void>;
  addClutch: (clutch: Omit<Clutch, 'id'>) => Promise<void>;
  updateClutch: (id: string, updates: Partial<Clutch>) => Promise<void>;
  resetToDefaultData: () => void;
  isConnectedToSupabase: boolean;
}

const GeckoContext = createContext<GeckoContextType | undefined>(undefined);

const LOCAL_STORAGE_GECKOS = 'crested_geckos_db';
const LOCAL_STORAGE_WEIGHTS = 'crested_weights_db';
const LOCAL_STORAGE_CLUTCHES = 'crested_clutches_db';

export const GeckoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [geckos, setGeckos] = useState<Gecko[]>([]);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [clutches, setClutches] = useState<Clutch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'geckos' | 'calculator' | 'lineage' | 'clutches' | 'supabase'>('dashboard');
  const [selectedGeckoId, setSelectedGeckoId] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: geckosData, error: gError } = await supabase.from('cg_geckos').select('*');
          const { data: weightsData } = await supabase.from('cg_weight_logs').select('*');
          const { data: clutchesData } = await supabase.from('cg_clutches').select('*');

          if (!gError && geckosData) {
            const mappedGeckos: Gecko[] = geckosData.map((row: any) => ({
              id: row.id,
              code: row.code,
              name: row.name,
              gender: row.gender,
              hatchDate: row.hatch_date,
              morph: row.morph,
              genetics: row.genetics || {},
              breederName: row.breeder_name,
              purchasePrice: row.purchase_price,
              purchaseDate: row.purchase_date,
              status: row.status,
              fatherId: row.father_id,
              motherId: row.mother_id,
              fatherName: row.father_name,
              motherName: row.mother_name,
              weightGrams: row.weight_grams,
              notes: row.notes,
              mainImageUrl: row.main_image_url || (row.images && row.images[0]) || undefined,
              images: row.images || (row.main_image_url ? [row.main_image_url] : []),
              createdAt: row.created_at
            }));
            setGeckos(mappedGeckos);

            if (weightsData) {
              setWeights(weightsData.map((w: any) => ({
                id: w.id,
                geckoId: w.gecko_id,
                weightGrams: w.weight_grams,
                date: w.date,
                notes: w.notes
              })));
            } else {
              setWeights([]);
            }

            if (clutchesData) {
              setClutches(clutchesData.map((c: any) => ({
                id: c.id,
                fatherId: c.father_id,
                motherId: c.mother_id,
                fatherName: c.father_name,
                motherName: c.mother_name,
                laidDate: c.laid_date,
                eggCount: c.egg_count,
                fertileCount: c.fertile_count,
                incubationTempC: c.incubation_temp_c,
                expectedHatchDate: c.expected_hatch_date,
                status: c.status,
                notes: c.notes
              })));
            } else {
              setClutches([]);
            }

            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Supabase fetch error, fallback to local storage:', e);
        }
      }

      // Local storage fallback
      const savedGeckos = localStorage.getItem(LOCAL_STORAGE_GECKOS);
      const savedWeights = localStorage.getItem(LOCAL_STORAGE_WEIGHTS);
      const savedClutches = localStorage.getItem(LOCAL_STORAGE_CLUTCHES);

      if (savedGeckos) {
        setGeckos(JSON.parse(savedGeckos));
      } else {
        setGeckos(INITIAL_GECKOS);
        localStorage.setItem(LOCAL_STORAGE_GECKOS, JSON.stringify(INITIAL_GECKOS));
      }

      if (savedWeights) {
        setWeights(JSON.parse(savedWeights));
      } else {
        setWeights(INITIAL_WEIGHTS);
        localStorage.setItem(LOCAL_STORAGE_WEIGHTS, JSON.stringify(INITIAL_WEIGHTS));
      }

      if (savedClutches) {
        setClutches(JSON.parse(savedClutches));
      } else {
        setClutches(INITIAL_CLUTCHES);
        localStorage.setItem(LOCAL_STORAGE_CLUTCHES, JSON.stringify(INITIAL_CLUTCHES));
      }

      setLoading(false);
    }

    loadData();
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(LOCAL_STORAGE_GECKOS, JSON.stringify(geckos));
    }
  }, [geckos, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(LOCAL_STORAGE_WEIGHTS, JSON.stringify(weights));
    }
  }, [weights, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(LOCAL_STORAGE_CLUTCHES, JSON.stringify(clutches));
    }
  }, [clutches, loading]);

  const addGecko = async (geckoData: Omit<Gecko, 'id' | 'createdAt'>) => {
    const newId = 'g-' + Date.now();
    const newGecko: Gecko = {
      ...geckoData,
      id: newId,
      createdAt: new Date().toISOString()
    };

    setGeckos(prev => [newGecko, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('cg_geckos').insert({
          code: newGecko.code,
          name: newGecko.name,
          gender: newGecko.gender,
          hatch_date: newGecko.hatchDate,
          morph: newGecko.morph,
          genetics: newGecko.genetics,
          breeder_name: newGecko.breederName,
          purchase_price: newGecko.purchasePrice,
          purchase_date: newGecko.purchaseDate,
          status: newGecko.status,
          father_id: newGecko.fatherId,
          mother_id: newGecko.motherId,
          father_name: newGecko.fatherName,
          mother_name: newGecko.motherName,
          weight_grams: newGecko.weightGrams,
          notes: newGecko.notes,
          main_image_url: newGecko.mainImageUrl || (newGecko.images && newGecko.images[0]) || null,
          images: newGecko.images || (newGecko.mainImageUrl ? [newGecko.mainImageUrl] : [])
        });
      } catch (err) {
        console.error('Supabase insert error:', err);
      }
    }
  };

  const updateGecko = async (id: string, updates: Partial<Gecko>) => {
    setGeckos(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));

    if (isSupabaseConfigured && supabase) {
      try {
        const payload: any = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.code !== undefined) payload.code = updates.code;
        if (updates.gender !== undefined) payload.gender = updates.gender;
        if (updates.hatchDate !== undefined) payload.hatch_date = updates.hatchDate;
        if (updates.morph !== undefined) payload.morph = updates.morph;
        if (updates.genetics !== undefined) payload.genetics = updates.genetics;
        if (updates.breederName !== undefined) payload.breeder_name = updates.breederName;
        if (updates.purchasePrice !== undefined) payload.purchase_price = updates.purchasePrice;
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.fatherId !== undefined) payload.father_id = updates.fatherId;
        if (updates.motherId !== undefined) payload.mother_id = updates.motherId;
        if (updates.weightGrams !== undefined) payload.weight_grams = updates.weightGrams;
        if (updates.notes !== undefined) payload.notes = updates.notes;
        if (updates.mainImageUrl !== undefined) payload.main_image_url = updates.mainImageUrl;
        if (updates.images !== undefined) {
          payload.images = updates.images;
          if (updates.images.length > 0) {
            payload.main_image_url = updates.images[0];
          }
        }

        await supabase.from('cg_geckos').update(payload).eq('id', id);
      } catch (err) {
        console.error('Supabase update error:', err);
      }
    }
  };

  const deleteGecko = async (id: string) => {
    setGeckos(prev => prev.filter(g => g.id !== id));
    if (selectedGeckoId === id) setSelectedGeckoId(null);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('cg_geckos').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete error:', err);
      }
    }
  };

  const addWeightLog = async (geckoId: string, weightGrams: number, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: WeightEntry = {
      id: 'w-' + Date.now(),
      geckoId,
      weightGrams,
      date: today,
      notes
    };

    setWeights(prev => [newEntry, ...prev]);
    await updateGecko(geckoId, { weightGrams });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('cg_weight_logs').insert({
          gecko_id: geckoId,
          weight_grams: weightGrams,
          date: today,
          notes
        });
      } catch (err) {
        console.error('Supabase weight log insert error:', err);
      }
    }
  };

  const addClutch = async (clutchData: Omit<Clutch, 'id'>) => {
    const newClutch: Clutch = {
      ...clutchData,
      id: 'c-' + Date.now()
    };

    setClutches(prev => [newClutch, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('cg_clutches').insert({
          father_id: clutchData.fatherId,
          mother_id: clutchData.motherId,
          father_name: clutchData.fatherName,
          mother_name: clutchData.motherName,
          laid_date: clutchData.laidDate,
          egg_count: clutchData.eggCount,
          fertile_count: clutchData.fertileCount,
          incubation_temp_c: clutchData.incubationTempC,
          expected_hatch_date: clutchData.expectedHatchDate,
          status: clutchData.status,
          notes: clutchData.notes
        });
      } catch (err) {
        console.error('Supabase clutch insert error:', err);
      }
    }
  };

  const updateClutch = async (id: string, updates: Partial<Clutch>) => {
    setClutches(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const resetToDefaultData = () => {
    setGeckos([]);
    setWeights([]);
    setClutches([]);
    localStorage.removeItem(LOCAL_STORAGE_GECKOS);
    localStorage.removeItem(LOCAL_STORAGE_WEIGHTS);
    localStorage.removeItem(LOCAL_STORAGE_CLUTCHES);
  };

  return (
    <GeckoContext.Provider
      value={{
        geckos,
        weights,
        clutches,
        loading,
        activeTab,
        setActiveTab,
        selectedGeckoId,
        setSelectedGeckoId,
        addGecko,
        updateGecko,
        deleteGecko,
        addWeightLog,
        addClutch,
        updateClutch,
        resetToDefaultData,
        isConnectedToSupabase: isSupabaseConfigured
      }}
    >
      {children}
    </GeckoContext.Provider>
  );
};

export const useGeckoContext = () => {
  const context = useContext(GeckoContext);
  if (!context) {
    throw new Error('useGeckoContext must be used within a GeckoProvider');
  }
  return context;
};
