import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockChartProps {
  data: Array<{ name: string; price: number }>;
  ticker: string;
}

export function StockChart({ data, ticker }: StockChartProps) {
  const formatTooltip = (value: any, name: string) => {
    return [`$${Number(value).toFixed(2)}`, 'Price'];
  };

  const formatDate = (tickItem: string) => {
    // Assuming the name is in YYYY-MM-DD format, show only MM-DD
    if (tickItem.includes('-')) {
      return tickItem.slice(5); // Remove YYYY- part
    }
    return tickItem;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Historical Price Data</span>
          <span className="text-sm font-normal text-muted-foreground">
            ({ticker})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickFormatter={formatDate}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={["auto", "auto"]} 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}