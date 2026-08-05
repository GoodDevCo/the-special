/* localStorage persistence layer */
const STORE_KEY = 'the-special:v1';

function loadDeals(){
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.deals) && parsed.deals.length) return parsed.deals;
    }
  } catch(e) { /* corrupt store — fall back to seed */ }
  return SEED_DEALS.map(d => ({...d}));
}

function saveDeals(deals){
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({v:1, savedAt: Date.now(), deals}));
  } catch(e) { /* storage unavailable (private mode) — in-memory only */ }
}
