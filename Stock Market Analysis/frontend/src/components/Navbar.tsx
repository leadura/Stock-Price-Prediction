import { Search, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-navbar-bg/95 backdrop-blur supports-[backdrop-filter]:bg-navbar-bg/60">
      <div className="flex h-14 items-center gap-4 px-4">
        <SidebarTrigger className="-ml-1" />
        
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground">
              Stock Price Predictor
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                className="pl-8 w-[200px] lg:w-[300px]"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}