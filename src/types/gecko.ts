export type Gender = 'male' | 'female' | 'unsexed';

export type GeckoStatus = 
  | 'breeder'    // Tenyészállat
  | 'for_sale'   // Eladó
  | 'reserved'   // Foglalt
  | 'sold'       // Eladott
  | 'pet'        // Kedvenc
  | 'deceased';  // Elpusztult

export interface GeckoGenetics {
  lillyWhite: boolean;         // Domináns/Co-domináns
  axanthic: 'visual' | 'het' | 'none'; // Recesszív
  cappuccino: 'super' | 'visual' | 'none'; // Co-domináns (Super Cap translucent)
  phantom: boolean;            // Phantom
  sable: boolean;              // Sable
  hypo?: boolean;              // Hypomelanistic
  // Poligénes / mintázat tulajdonságok
  pattern: 'patternless' | 'bicolor' | 'flame' | 'harlequin' | 'extreme_harlequin' | 'tricolor';
  pinstripe: 'none' | 'low' | 'partial' | 'full' | 'quadstripe';
  dalmatian: 'none' | 'low' | 'high' | 'super';
  whitewall: boolean;
  inkSpot: boolean;
}


export interface Gecko {
  id: string;
  code: string;              // pl. CG-2024-001
  name: string;
  gender: Gender;
  hatchDate?: string;        // ISO dátum pl. "2023-05-12"
  morph: string;             // Teljes morph megnevezés pl. "Tricolor Extreme Harlequin Lilly White"
  genetics: GeckoGenetics;
  breederName?: string;      // Vásárolt tenyésztő neve (pl. "Crested Genetics EU")
  purchasePrice?: number;    // Ár (HUF vagy EUR)
  purchaseDate?: string;
  status: GeckoStatus;
  fatherId?: string;         // Apa azonosítója
  motherId?: string;         // Anya azonosítója
  fatherName?: string;       // Szabad szavas apa név
  motherName?: string;       // Szabad szavas anya név
  fatherImageUrl?: string;   // Apa fotója (ha nincsen az adatbázisban)
  motherImageUrl?: string;   // Anya fotója (ha nincsen az adatbázisban)
  weightGrams?: number;      // Utolsó mért súly
  notes?: string;
  mainImageUrl?: string;
  images?: string[];
  createdAt: string;
}


export interface WeightEntry {
  id: string;
  geckoId: string;
  weightGrams: number;
  date: string;
  notes?: string;
}

export interface Clutch {
  id: string;
  fatherId?: string;
  motherId?: string;
  fatherName?: string;
  motherName?: string;
  laidDate: string;
  eggCount: number;
  fertileCount: number;
  incubationTempC: number;
  expectedHatchDate: string;
  status: 'incubating' | 'hatched' | 'spoiled';
  notes?: string;
}

export interface MorphOutcome {
  morphName: string;
  probabilityPercent: number;
  genotypeDescription: string;
  isLethalWarning?: boolean;
  isRareCombination?: boolean;
}
