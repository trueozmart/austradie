import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { slugify } from './categories';
import type { Listing } from './types';

const PAGE_SIZE = 100;

interface Filters {
  category?: string;
  state?: string;
  suburbSlug?: string;
  search?: string;
}

export function usePaginatedListings(filters: Filters, page: number) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    async function load() {
      // Suburb pages match against a slugified suburb name, which can't be
      // expressed as a Postgres filter, so fetch the category/state set and
      // filter + paginate client-side.
      if (filters.suburbSlug) {
        let query = supabase
          .from('listings')
          .select('*')
          .order('is_corepages_client', { ascending: false })
          .order('name', { ascending: true });

        if (filters.category) query = query.eq('category', filters.category);
        if (filters.state) query = query.eq('state', filters.state);

        const { data, error } = await query;
        if (!active) return;

        if (error) {
          console.error(error);
          setListings([]);
          setTotal(0);
        } else {
          const matched = (data || []).filter(
            (l) => l.suburb && slugify(l.suburb) === filters.suburbSlug
          );
          const from = (page - 1) * PAGE_SIZE;
          setListings(matched.slice(from, from + PAGE_SIZE));
          setTotal(matched.length);
        }
        setLoading(false);
        return;
      }

      let query = supabase
        .from('listings')
        .select('*', { count: 'exact' })
        .order('is_corepages_client', { ascending: false })
        .order('name', { ascending: true });

      if (filters.category) query = query.eq('category', filters.category);
      if (filters.state) query = query.eq('state', filters.state);
      if (filters.search) query = query.ilike('suburb', `%${filters.search}%`);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (!active) return;

      if (error) {
        console.error(error);
        setListings([]);
        setTotal(0);
      } else {
        setListings(data || []);
        setTotal(count ?? 0);
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [filters.category, filters.state, filters.suburbSlug, filters.search, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return { listings, total, totalPages, loading };
}
