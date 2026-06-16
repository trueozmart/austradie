import { useEffect, useRef, useState } from 'react';
import { matchSuburbs, useSuburbDirectory, type SuburbEntry } from '../lib/useSuburbDirectory';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (entry: SuburbEntry) => void;
  placeholder?: string;
  inputClassName?: string;
  /** When set, suggestions are limited to this state (label, e.g. "VIC"). */
  stateFilter?: string;
  autoFocus?: boolean;
}

export default function LocationAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  inputClassName,
  stateFilter,
  autoFocus,
}: LocationAutocompleteProps) {
  const suburbs = useSuburbDirectory();
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const matches = matchSuburbs(suburbs, value, 8, stateFilter);

  useEffect(() => {
    setHighlight(0);
  }, [value, stateFilter]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectEntry(entry: SuburbEntry) {
    onSelect(entry);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || matches.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h - 1 + matches.length) % matches.length);
    } else if (e.key === 'Enter') {
      if (matches[highlight]) {
        e.preventDefault();
        selectEntry(matches[highlight]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setHighlight(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={inputClassName}
        autoComplete="off"
        autoFocus={autoFocus}
      />
      {open && matches.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white py-1 text-left shadow-lg">
          {matches.map((entry, i) => (
            <li key={`${entry.suburb}-${entry.state}`}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectEntry(entry)}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm ${
                  i === highlight ? 'bg-gold-light/40' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-navy">{entry.suburb}</span>
                <span className="text-xs text-gray-500">
                  {entry.state}
                  {entry.postcode ? ` ${entry.postcode}` : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
