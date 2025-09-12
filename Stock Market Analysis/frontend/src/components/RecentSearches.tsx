import { Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecentSearchesProps {
  recentTickers: string[];
  onTickerSelect: (ticker: string) => void;
  onClear?: () => void;   // ✅ optional clear handler
}

export function RecentSearches({ recentTickers, onTickerSelect, onClear }: RecentSearchesProps) {
  if (recentTickers.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        {/* Left: title */}
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Recent Searches
        </CardTitle>

        {/* Right: clear button */}
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs text-red-600 hover:bg-red-50"
          >
            Clear
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {recentTickers.slice(0, 3).map((ticker) => (
            <Button
              key={ticker}
              variant="outline"
              size="sm"
              onClick={() => {
                const symbol = ticker.split("–").pop()?.trim() || ticker;
                onTickerSelect(symbol);
              }}
              className="h-8 text-xs hover:bg-primary/10 hover:border-primary/20"
            >
              {ticker}
            </Button>
          ))}
        </div>

        {recentTickers.length > 3 && (
          <p className="text-xs text-muted-foreground mt-2">
            +{recentTickers.length - 3} more
          </p>
        )}
      </CardContent>
    </Card>
  );
}
