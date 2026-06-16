import { useEffect, useState } from 'react';

export interface SuburbEntry {
  suburb: string;
  state: string;
  postcode: string | null;
}

let cache: SuburbEntry[] | null = null;
let inflight: Promise<SuburbEntry[]> | null = null;

async function loadSuburbs(): Promise<SuburbEntry[]> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    const mod = await import('../data/au-suburbs.json');
    const { states, suburbs } = mod.default as {
      states: string[];
      suburbs: [string, number, string][];
    };

    cache = suburbs.map(([suburb, stateIdx, postcode]) => ({
      suburb,
      state: states[stateIdx],
      postcode,
    }));
    inflight = null;
    return cache;
  })();

  return inflight;
}

/** Australia-wide suburb/postcode directory, for location search suggestions. */
export function useSuburbDirectory() {
  const [suburbs, setSuburbs] = useState<SuburbEntry[]>(cache ?? []);

  useEffect(() => {
    let active = true;
    if (cache) {
      setSuburbs(cache);
      return;
    }
    loadSuburbs().then((data) => {
      if (active) setSuburbs(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return suburbs;
}

export function matchSuburbs(
  suburbs: SuburbEntry[],
  query: string,
  limit = 8,
  stateFilter?: string
): SuburbEntry[] {
  const pool = stateFilter
    ? suburbs.filter((s) => s.state.toLowerCase() === stateFilter.toLowerCase())
    : suburbs;

  const q = query.trim().toLowerCase();
  if (!q) {
    // With no query, only show suggestions once a state has been chosen.
    return stateFilter ? pool.slice(0, limit) : [];
  }

  const starts: SuburbEntry[] = [];
  const contains: SuburbEntry[] = [];

  for (const entry of pool) {
    const suburbLower = entry.suburb.toLowerCase();
    const postcode = entry.postcode || '';
    if (suburbLower.startsWith(q) || postcode.startsWith(q)) {
      starts.push(entry);
    } else if (suburbLower.includes(q)) {
      contains.push(entry);
    }
    if (starts.length >= limit) break;
  }

  return [...starts, ...contains].slice(0, limit);
}
