import { useEffect, useState } from 'react';
import { supabase } from './supabase';

interface LocationCount {
  suburb: string;
  state: string | null;
  count: number;
}

export function useLocationBreakdown(category: string, state?: string) {
  const [locations, setLocations] = useState<LocationCount[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      let query = supabase.from('listings').select('suburb, state').eq('category', category);
      if (state) query = query.eq('state', state);

      const { data, error } = await query;
      if (!active || error || !data) return;

      const counts = new Map<string, LocationCount>();
      for (const row of data) {
        if (!row.suburb) continue;
        const key = `${row.suburb}|${row.state ?? ''}`;
        const existing = counts.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          counts.set(key, { suburb: row.suburb, state: row.state, count: 1 });
        }
      }

      const sorted = Array.from(counts.values()).sort((a, b) => b.count - a.count);
      setLocations(sorted);
    }

    load();
    return () => {
      active = false;
    };
  }, [category, state]);

  return locations;
}
