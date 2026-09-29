import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SearchResult } from "@/hooks/useDestinations";

const MAX_SUGGESTIONS = 3;
const DEBOUNCE_MS = 500;

interface SearchBarProps {
  onSearch: (query: string) => void;
  /** Should be a stable function (e.g. a useState setter) or the debounce timer resets every render */
  onDebounce: (query: string) => void;
  results: SearchResult[];
  loading: boolean;
  error: Error | null;
  onResultClick: (lat: string, lon: string) => void;
}

export default function SearchBar({
  onSearch,
  onDebounce,
  results,
  loading,
  error,
  onResultClick,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const formRef = useRef<HTMLFormElement>(null);

  // Keyboard nav and rendering both use this list, so they can't disagree
  const suggestions = results.slice(0, MAX_SUGGESTIONS);
  const listVisible = open && suggestions.length > 0;

  const selectResult = (result: SearchResult) => {
    onResultClick(result.lat, result.lon);
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!listVisible) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (
      (e.key === "ArrowRight" || e.key === "Tab") &&
      highlighted >= 0
    ) {
      e.preventDefault();
      setQuery(suggestions[highlighted].display_name);
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      selectResult(suggestions[highlighted]);
    }
  };

  const handleClear = () => {
    setQuery("");
    setHighlighted(-1);
    onDebounce("");
    setOpen(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => onDebounce(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query, onDebounce]);

  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="relative flex w-full min-w-0 items-center gap-2"
    >
      <div className="relative min-w-0 flex-1">
        <Input
          name="search"
          type="text"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlighted(-1);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim() && results.length > 0) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search location..."
          aria-label="Search location"
          className="w-full min-w-0 rounded-xl border border-input bg-background/90 pr-9 backdrop-blur placeholder:text-muted-foreground transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-lg leading-none text-muted-foreground hover:text-foreground/70"
          >
            ×
          </button>
        )}
      </div>

      <Button type="submit" size="sm" className="shrink-0 px-3">
        Search
      </Button>

      {open && (loading || error || suggestions.length > 0) && (
        <div className="absolute left-0 top-full z-[60] mt-2 w-full rounded-xl border border-border bg-card shadow-lg">
          {loading && (
            <p className="p-2 text-xs text-muted-foreground">Searching…</p>
          )}
          {error && (
            <p className="p-2 text-xs text-destructive">{error.message}</p>
          )}

          <ul role="listbox" className="divide-y divide-border">
            {suggestions.map((result, idx) => (
              <li
                key={`${result.lat}-${result.lon}-${idx}`}
                role="option"
                aria-selected={highlighted === idx}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  highlighted === idx ? "bg-accent" : "hover:bg-accent/50"
                }`}
                onMouseEnter={() => setHighlighted(idx)}
                onClick={() => selectResult(result)}
              >
                {result.display_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
