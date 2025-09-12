import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionCard } from "./PredictionCard";
import { StockChart } from "./StockChart";
import { RecentSearches } from "./RecentSearches";

export function Dashboard() {
  const [ticker, setTicker] = useState("");
  const [search, setSearch] = useState(""); // what user types / shown in input
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [prediction, setPrediction] = useState<number | null>(null);
  const [history, setHistory] = useState<Array<{ name: string; price: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentTickers, setRecentTickers] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent-tickers");
    if (saved) setRecentTickers(JSON.parse(saved));
  }, []);

  const saveToRecent = (display: string, symbol: string) => {
    const entry = `${display} – ${symbol.toUpperCase()}`;
    const updated = [entry, ...recentTickers.filter((t) => t !== entry)].slice(0, 5);
    setRecentTickers(updated);
    localStorage.setItem("recent-tickers", JSON.stringify(updated));
  };


  const clearRecent = () => {
    setRecentTickers([]);
    localStorage.removeItem("recent-tickers");
  };

  // Outside click -> close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced fetch for suggestions
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!search || search.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      try {
        const url = `http://127.0.0.1:5000/search?q=${encodeURIComponent(search)}`;
        const res = await fetch(url);
        const data = await res.json();
        const quotes = data.quotes || [];
        setSuggestions(quotes);
        setShowDropdown(quotes.length > 0);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [search]);

  // Handle selecting a suggestion
  const handleSelect = (symbol: string, name?: string) => {
    const symbolUpper = symbol.toUpperCase();
    const display = name && name !== symbol ? name : symbolUpper;

    setTicker(symbolUpper);
    setSearch(`${display} – ${symbolUpper}`);
    setShowDropdown(false);

    fetchPrediction(symbolUpper, display);
    saveToRecent(display, symbolUpper);
  };



  // Handle pressing Enter
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        const first = suggestions[0];
        handleSelect(first.symbol, first.shortname || first.symbol);
      } else if (search.trim()) {
        // fallback: try raw input
        setTicker(search.trim().toUpperCase());
        fetchPrediction(search.trim());
      }
    }
  };

  const fetchPrediction = async (tickerSymbol?: string, displayName?: string) => {
    let targetTicker = tickerSymbol || ticker;
    if (!targetTicker) return;

    setLoading(true);
    setError("");
    setPrediction(null);
    setHistory([]);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: targetTicker }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || `Server error ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setHistory(data.recent_history || []);
      setTicker(targetTicker.toUpperCase());

      const symbolUpper = targetTicker.toUpperCase();
      const display = displayName && displayName !== symbolUpper ? displayName : symbolUpper;

      setSearch(`${display} – ${symbolUpper}`);
      saveToRecent(display, symbolUpper);
    } catch (err) {
      console.error("Prediction error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setShowDropdown(false);
    }
  };


  const getPreviousPrice = () =>
    history.length > 0 ? history[history.length - 1].price : undefined;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Stock Predictions Dashboard
        </h2>
        <p className="text-muted-foreground">
          Get AI-powered stock price predictions and view historical data
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchPrediction();
            }}
            className="flex flex-col gap-2 relative"
          >
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search company or ticker (e.g., Apple, Reliance)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowDropdown(suggestions.length > 0)}
                onKeyDown={handleKeyDown}
                className="text-sm"
              />

              {showDropdown && suggestions.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((s) => (
                    <div
                      key={s.symbol + (s.exchange || "")}
                      onClick={() => handleSelect(s.symbol, s.shortname || s.symbol)}
                      className="p-2 text-sm cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex justify-between">
                        <div>{s.shortname || s.symbol}</div>
                        <div className="text-xs text-gray-500">{s.exchange}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{s.symbol}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !search.trim()}
              className="min-w-[100px]"
            >
              {loading ? "Analyzing..." : "Predict"}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Searches */}
      <RecentSearches
        recentTickers={recentTickers}
        onTickerSelect={(t) => fetchPrediction(t)}
        onClear={clearRecent}
      />

      {/* Results Grid */}
      {(prediction !== null || history.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prediction !== null && (
            <div className="md:col-span-1">
              <PredictionCard
                prediction={prediction}
                ticker={ticker}
                previousPrice={getPreviousPrice()}
              />
            </div>
          )}
          {history.length > 0 && (
            <div className="md:col-span-2 lg:col-span-2">
              <StockChart data={history} ticker={ticker} />
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Analyzing {ticker}...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && prediction === null && history.length === 0 && !error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to predict</h3>
            <p className="text-muted-foreground max-w-md">
              Enter a stock ticker symbol above to get AI-powered price predictions and view historical data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
