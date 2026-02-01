
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { User, CityData, WeatherDay, Theme } from '../types';
import MapComponent from './MapComponent';
import { analyzeFloodRisk } from '../services/gemini';
import { 
  CloudIcon, 
  MapPinIcon, 
  MagnifyingGlassIcon, 
  ArrowRightOnRectangleIcon, 
  LanguageIcon,
  ShieldCheckIcon,
  SunIcon,
  MoonIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, theme, onToggleTheme }) => {
  const { t, toggleLanguage, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [cityData, setCityData] = useState<CityData | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const generateMockForecast = (): WeatherDay[] => {
    const conditions = ['Sunny', 'PartlyCloudy', 'Cloudy', 'Rainy', 'Stormy'];
    return Array.from({ length: 7 }).map((_, i) => ({
      date: new Date(Date.now() + i * 86400000).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      temp: Math.floor(Math.random() * 15) + 20,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipitation: Math.floor(Math.random() * 100)
    }));
  };

  // Re-localize current data when language changes
  useEffect(() => {
    if (cityData) {
      const updateLocalization = async () => {
        setLoading(true);
        // Regenerate forecast dates in new language
        const updatedForecast = cityData.forecast.map((day, i) => ({
          ...day,
          date: new Date(Date.now() + i * 86400000).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        }));

        // Re-analyze risk in new language
        const aiSummary = await analyzeFloodRisk(cityData.name, updatedForecast, language);
        
        setCityData(prev => prev ? ({
          ...prev,
          forecast: updatedForecast,
          riskSummary: aiSummary
        }) : null);
        setLoading(false);
      };
      updateLocalization();
    }
  }, [language]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&accept-language=${language}&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const first = data[0];
        const forecast = generateMockForecast();
        const riskLevels: CityData['floodRisk'][] = ['Low', 'Moderate', 'High', 'Critical'];
        const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
        
        const displayName = first.display_name.split(',')[0];
        const aiSummary = await analyzeFloodRisk(displayName, forecast, language);

        setCityData({
          name: displayName,
          lat: parseFloat(first.lat),
          lng: parseFloat(first.lon),
          floodRisk: randomRisk,
          forecast,
          riskSummary: aiSummary
        });
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'text-red-600 bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-800';
      case 'High': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-800';
      default: return 'text-green-600 bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800';
    }
  };

  const getConditionText = (conditionKey: string) => {
    const key = `condition_${conditionKey}` as keyof typeof t;
    return t[key] || conditionKey;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-500">
      <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 shrink-0 shadow-sm transition-colors duration-500">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 dark:shadow-none">
            F
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none">FloodGuard</h1>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Risk Intelligence</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-4 sm:mx-8">
          <form onSubmit={handleSearch} className="relative group">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-12 py-2 bg-slate-100 dark:bg-slate-800 border-transparent border focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl transition-all outline-none text-slate-900 dark:text-slate-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {searchQuery && !loading && (
              <button 
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
            
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => theme !== 'light' && onToggleTheme()}
              className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-200'}`}
              title={t.theme_Light}
            >
              <SunIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => theme !== 'dark' && onToggleTheme()}
              className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-700 shadow-sm text-yellow-400' : 'text-slate-400 hover:text-slate-600'}`}
              title={t.theme_Dark}
            >
              <MoonIcon className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-100 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm active:scale-95"
          >
            <LanguageIcon className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">{t.changeLang}</span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            title={t.logout}
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-full sm:w-[420px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto p-6 hidden lg:block transition-colors duration-500">
          {!cityData ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 dark:opacity-20">
              <MapPinIcon className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">{t.noData}</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <section>
                <div className="flex items-start justify-between mb-4">
                  <div className="max-w-[70%]">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight break-words">{cityData.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {cityData.lat.toFixed(4)}°N, {cityData.lng.toFixed(4)}°E
                    </p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shrink-0 ${getRiskColor(cityData.floodRisk)}`}>
                    {t[`floodRisk_${cityData.floodRisk}` as keyof typeof t]}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
                  <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-400 font-black text-xs uppercase tracking-widest">
                    <ShieldCheckIcon className="w-5 h-5" />
                    {t.aiAnalysis}
                  </div>
                  <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {cityData.riskSummary}
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{t.forecastTitle}</h3>
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                    <CloudIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  {cityData.forecast.map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 group">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{day.date}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{getConditionText(day.condition)}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="block text-base font-black text-slate-800 dark:text-slate-100">{day.temp}°C</span>
                          <span className="block text-[11px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-tighter opacity-80">{day.precipitation}% precip.</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </aside>

        <section className="flex-1 relative bg-slate-200 dark:bg-slate-950 transition-colors duration-500">
          <MapComponent 
            center={cityData ? [cityData.lat, cityData.lng] : [20.5937, 78.9629]} 
            zoom={cityData ? 12 : 5}
            cityName={cityData?.name}
          />
          
          <div className="lg:hidden absolute bottom-6 left-6 right-6 z-[1000]">
             {cityData && (
                <div className="glass-panel dark:bg-slate-900/90 dark:border-slate-700 rounded-3xl p-6 shadow-2xl shadow-slate-950/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex justify-between items-center mb-4">
                     <div>
                       <h2 className="font-black text-slate-900 dark:text-white text-xl leading-tight">{cityData.name}</h2>
                       <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{getConditionText(cityData.forecast[0].condition)} • {cityData.forecast[0].temp}°C</p>
                     </div>
                     <div className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shrink-0 ${getRiskColor(cityData.floodRisk)}`}>
                        {t[`floodRisk_${cityData.floodRisk}` as keyof typeof t]}
                     </div>
                   </div>
                   <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-4 leading-relaxed font-medium">{cityData.riskSummary}</p>
                </div>
             )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
