import type { GeckoGenetics, MorphOutcome } from '../types/gecko';

export const DEFAULT_GENETICS: GeckoGenetics = {
  lillyWhite: false,
  axanthic: 'none',
  cappuccino: 'none',
  phantom: false,
  sable: false,
  hypo: false,
  pattern: 'patternless',
  pinstripe: 'none',
  dalmatian: 'none',
  whitewall: false,
  inkSpot: false
};



/**
 * Generates a human readable morph description string from genetics flags
 */
export function buildMorphString(genetics: GeckoGenetics): string {
  const parts: string[] = [];

  if (genetics.hypo) parts.push('Hypo');

  // Recessives
  if (genetics.axanthic === 'visual') parts.push('Axanthic');
  else if (genetics.axanthic === 'het') parts.push('Het Axanthic');


  // Co-dominants & Dominants
  if (genetics.cappuccino === 'super') parts.push('Super Cappuccino (Translucent)');
  else if (genetics.cappuccino === 'visual') parts.push('Cappuccino');

  if (genetics.lillyWhite) parts.push('Lilly White');
  if (genetics.phantom) parts.push('Phantom');
  if (genetics.sable) parts.push('Sable');

  // Structural & Patterns
  if (genetics.pattern === 'tricolor') parts.push('Tricolor');
  else if (genetics.pattern === 'extreme_harlequin') parts.push('Extreme Harlequin');
  else if (genetics.pattern === 'harlequin') parts.push('Harlequin');
  else if (genetics.pattern === 'flame') parts.push('Flame');
  else if (genetics.pattern === 'bicolor') parts.push('Bicolor');

  // Pinstripe
  if (genetics.pinstripe === 'quadstripe') parts.push('Quadstripe');
  else if (genetics.pinstripe === 'full') parts.push('Full Pinstripe');
  else if (genetics.pinstripe === 'partial') parts.push('Partial Pinstripe');

  // Traits
  if (genetics.whitewall) parts.push('Whitewall');
  if (genetics.dalmatian === 'super') parts.push('Super Dalmatian');
  else if (genetics.dalmatian === 'high') parts.push('High Spot Dalmatian');
  else if (genetics.dalmatian === 'low') parts.push('Dalmatian');
  if (genetics.inkSpot) parts.push('Ink Spot');

  if (parts.length === 0) {
    return genetics.pattern === 'patternless' ? 'Patternless' : 'Normal / Wild Type';
  }

  return parts.join(' ');
}


/**
 * Calculates possible offspring morph outcomes based on Parent 1 and Parent 2 genetics
 */
export function calculateMorphOutcomes(parent1: GeckoGenetics, parent2: GeckoGenetics): MorphOutcome[] {
  const outcomes: MorphOutcome[] = [];

  // Check Lilly White lethal combination
  const p1LW = parent1.lillyWhite;
  const p2LW = parent2.lillyWhite;

  if (p1LW && p2LW) {
    outcomes.push({
      morphName: 'Super Lilly (LETHAL / Nem életképes)',
      probabilityPercent: 25,
      genotypeDescription: 'Homozigóta Lilly White (LW/LW). A tojásban elhal vagy a kikelést követően rövid időn belül elpusztul. ENNEK A PÁROSÍTÁSNAK A HASZNÁLATA NEM AJÁNLOTT!',
      isLethalWarning: true
    });
  }

  // Calculate LW odds
  let lwProb = 0;
  if (p1LW && p2LW) lwProb = 50; // 50% LW, 25% Super Lilly (lethal), 25% Non-LW
  else if (p1LW || p2LW) lwProb = 50; // 50% LW, 50% Non-LW
  else lwProb = 0;

  // Calculate Axanthic odds
  const getAxAlleles = (status: 'visual' | 'het' | 'none') => {
    if (status === 'visual') return ['ax', 'ax'];
    if (status === 'het') return ['ax', '+'];
    return ['+', '+'];
  };

  const p1Ax = getAxAlleles(parent1.axanthic);
  const p2Ax = getAxAlleles(parent2.axanthic);

  let axVisualCount = 0;
  let axHetCount = 0;
  let axNoneCount = 0;

  for (const a1 of p1Ax) {
    for (const a2 of p2Ax) {
      if (a1 === 'ax' && a2 === 'ax') axVisualCount++;
      else if (a1 === 'ax' || a2 === 'ax') axHetCount++;
      else axNoneCount++;
    }
  }

  const totalAx = 4;
  const axVisualPct = (axVisualCount / totalAx) * 100;
  const axHetPct = (axHetCount / totalAx) * 100;
  const axNonePct = (axNoneCount / totalAx) * 100;

  // Calculate Cappuccino odds
  const p1Cap = parent1.cappuccino;
  const p2Cap = parent2.cappuccino;

  let capSuperPct = 0;

  if (p1Cap === 'visual' && p2Cap === 'visual') {
    capSuperPct = 25;
  }

  // Base pattern prediction (blended polygenic inheritance estimation)
  const patternType = (parent1.pattern === 'tricolor' || parent2.pattern === 'tricolor') ? 'Tricolor / Harlequin'
    : (parent1.pattern === 'extreme_harlequin' || parent2.pattern === 'extreme_harlequin') ? 'Extreme Harlequin'
    : (parent1.pattern === 'harlequin' || parent2.pattern === 'harlequin') ? 'Harlequin / Flame'
    : 'Flame / Patternless';

  // Pinstripe estimation
  const pinstripeDesc = (parent1.pinstripe === 'quadstripe' || parent2.pinstripe === 'quadstripe')
    ? '50% Quadstripe / High Pinstripe'
    : (parent1.pinstripe === 'full' || parent2.pinstripe === 'full')
    ? '50% Full Pinstripe, 50% Partial Pinstripe'
    : '25-50% Partial Pinstripe';

  // Dalmatian estimation
  const dalmatianDesc = (parent1.dalmatian !== 'none' || parent2.dalmatian !== 'none')
    ? 'Várhatóan pettyes / Dalmatian foltok megjelenése'
    : 'Nincs Dalmatian foltosodás';

  // Build main probability combos
  if (lwProb > 0) {
    if (axVisualPct > 0) {
      outcomes.push({
        morphName: `Visual Axanthic Lilly White (${patternType})`,
        probabilityPercent: Math.round((lwProb / 100) * (axVisualPct / 100) * 100),
        genotypeDescription: `Vizuális Axanthic + Lilly White kombináció. ${pinstripeDesc}. Különleges, ritka szürke/fehér kontrasztú fenotípus!`,
        isRareCombination: true
      });
    }

    if (axHetPct > 0) {
      outcomes.push({
        morphName: `Lilly White 100% Het Axanthic (${patternType})`,
        probabilityPercent: Math.round((lwProb / 100) * (axHetPct / 100) * 100),
        genotypeDescription: `Lilly White vizuális jegyek, rejtett Axanthic genotípussal. ${pinstripeDesc}.`
      });
    }

    outcomes.push({
      morphName: `Lilly White (${patternType})`,
      probabilityPercent: Math.round((lwProb / 100) * (axNonePct / 100) * 100),
      genotypeDescription: `Klasszikus csodálatos Lilly White mintázat. ${pinstripeDesc}, ${dalmatianDesc}.`
    });
  }

  // Non Lilly White outcomes
  const nonLwProb = 100 - lwProb - (p1LW && p2LW ? 25 : 0);

  if (nonLwProb > 0) {
    if (axVisualPct > 0) {
      outcomes.push({
        morphName: `Visual Axanthic (${patternType})`,
        probabilityPercent: Math.round((nonLwProb / 100) * (axVisualPct / 100) * 100),
        genotypeDescription: `Dupla recesszív Axanthic kifejeződés (sárga/vörös pigmentek hiánya). ${pinstripeDesc}.`,
        isRareCombination: true
      });
    }

    if (axHetPct > 0) {
      outcomes.push({
        morphName: `${patternType} (100% Het Axanthic)`,
        probabilityPercent: Math.round((nonLwProb / 100) * (axHetPct / 100) * 100),
        genotypeDescription: `Normál színváltozat, de genetikailag igazoltan 100% Het Axanthic hordozó. ${pinstripeDesc}.`
      });
    }

    if (axNonePct > 0 && axHetPct === 0 && axVisualPct === 0) {
      outcomes.push({
        morphName: `${patternType}`,
        probabilityPercent: Math.round((nonLwProb / 100) * (axNonePct / 100) * 100),
        genotypeDescription: `Alapértelmezett fenotípus. ${pinstripeDesc}, ${dalmatianDesc}.`
      });
    }
  }

  if (capSuperPct > 0) {
    outcomes.push({
      morphName: 'Super Cappuccino (Translucent)',
      probabilityPercent: capSuperPct,
      genotypeDescription: 'Homozigóta Cappuccino - áttetsző, sötét, mintázat nélküli egyedi megjelenés.',
      isRareCombination: true
    });
  }

  if (p1Cap === 'visual' && p1LW) {
    outcomes.push({
      morphName: 'Super Stripe / Cappuccino Lilly White',
      probabilityPercent: 25,
      genotypeDescription: 'Cappuccino + Lilly White együttműködése: rendkívül éles háti és oldalsó csíkozás!',
      isRareCombination: true
    });
  }

  return outcomes;
}
