import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FilterProvider } from './store/FilterContext';
import { FlightSearchForm } from './components/search/FlightSearchForm';
import { FlightResultsList } from './components/results/FlightResultsList';
import { FilterSidebar } from './components/filters/FilterSidebar';
import { PriceGraph } from './components/analytics/PriceGraph';
import { useFlights } from './hooks/useFlights';
import { Plane, Filter, X, Bookmark } from 'lucide-react';
import { BookmarksPage } from './pages/BookmarksPage';
import { cn } from './components/ui';

const queryClient = new QueryClient();

/**
 * Search Page Component
 */
const SearchPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { flights, stats, isLoading, error } = useFlights();

  return (
    <>
      <section className="bg-slate-900/30 border-b border-slate-800/50 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Search less, <span className="text-brand-teal">travel more.</span></h2>
            <p className="text-slate-400 font-medium md:text-lg max-w-2xl mx-auto uppercase tracking-wide text-xs">AI-powered flight search with real-time price analysis.</p>
        </div>
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <FlightSearchForm isLoading={isLoading} />
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 w-full py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-slate-300 shadow-sm mb-6 active:scale-95 transition-transform"
          >
            <Filter className="w-5 h-5 text-brand-teal" /> Filters
          </button>

          <FilterSidebar 
            flights={flights} 
            isOpen={isFilterOpen} 
            onClose={() => setIsFilterOpen(false)} 
          />

          <div className="flex-1 transition-all duration-500">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 animate-in shake duration-500">
                 <div className="p-2 bg-slate-900 rounded-lg"><X className="w-5 h-5 text-red-500" /></div>
                 <div>
                    <p className="font-bold">API Connection Error</p>
                    <p className="text-sm opacity-80">Unable to reach Amadeus servers. Verify your API credentials in .env.</p>
                 </div>
              </div>
            )}
            
            <PriceGraph flights={flights} isLoading={isLoading} />
            <FlightResultsList flights={flights} stats={stats} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </>
  );
};

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-40 bg-brand-darker-blue/80 backdrop-blur-md border-b border-slate-800/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
           <div className="bg-brand-teal p-2 rounded-xl shadow-lg shadow-brand-teal/20 rotate-12 group-hover:rotate-0 transition-transform">
              <Plane className="w-6 h-6 text-brand-darker-blue" />
           </div>
           <h1 className="text-xl font-black text-white tracking-tight italic">SPOTTER<span className="text-brand-teal">AI</span></h1>
        </Link>
        <div className="flex items-center gap-6">
           <Link 
            to="/bookmarks" 
            className={cn(
               "flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all",
               location.pathname === '/bookmarks' ? "text-brand-teal" : "text-slate-500 hover:text-brand-teal"
            )}
           >
              <Bookmark className={cn("w-4 h-4", location.pathname === '/bookmarks' && "fill-brand-teal")} />
              <span className="hidden sm:inline">Bookmarks</span>
           </Link>
        </div>
      </div>
    </header>
  );
};

/**
 * Main application component containing the search and results layout.
 */
const MainApp = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-darker-blue text-slate-200 selection:bg-brand-teal/30">
      <Header />
      
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
      </Routes>

      <footer className="border-t border-slate-800/50 py-12 px-6 bg-brand-darker-blue mt-auto">
        <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
                SpotterAI © {new Date().getFullYear()}. Built with React v19, TypeScript & Tailwind v4.<br/>
                Powered by Amadeus Self-Service APIs.
            </p>
        </div>
      </footer>
    </div>
  );
};

/**
 * Root Application component with Providers.
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </FilterProvider>
    </QueryClientProvider>
  );
};

export default App;
