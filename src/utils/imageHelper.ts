export const DEFAULT_GECKO_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230b0f17"/><circle cx="400" cy="270" r="90" fill="%23121826" stroke="%2310b981" stroke-width="3" stroke-dasharray="8 6"/><path d="M370 270 Q400 230 430 270 T400 320 Z" fill="%2310b981" opacity="0.8"/><circle cx="385" cy="255" r="5" fill="%23ffffff"/><circle cx="415" cy="255" r="5" fill="%23ffffff"/><circle cx="385" cy="255" r="2" fill="%230b0f17"/><circle cx="415" cy="255" r="2" fill="%230b0f17"/><text x="400" y="430" font-family="sans-serif" font-size="24" font-weight="700" fill="%2364748b" text-anchor="middle">🦎 Nincs Fotó Feltöltve</text></svg>`;

export const getGeckoImage = (gecko?: { mainImageUrl?: string; images?: string[] } | null): string => {
  if (!gecko) return DEFAULT_GECKO_IMAGE;
  if (gecko.images && gecko.images.length > 0 && gecko.images[0] && gecko.images[0].trim() !== '') {
    return gecko.images[0];
  }
  if (gecko.mainImageUrl && gecko.mainImageUrl.trim() !== '') {
    return gecko.mainImageUrl;
  }
  return DEFAULT_GECKO_IMAGE;
};
