import { useMemo, useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, ArrowLeft, AlertCircle, Info, Play, Square, Pause } from 'lucide-react';
import AyahSymbol from '@/components/ui/ayahSymbol';

const PageView = () => {
  const [selectedJuz, setSelectedJuz] = useState(null);
  const [juzPageIndex, setJuzPageIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState('next');
  const [juzData, setJuzData] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingAyah, setPlayingAyah] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const audioRef = useRef(null);
  const isAutoPlayingRef = useRef(isAutoPlaying);

  useEffect(() => {
    isAutoPlayingRef.current = isAutoPlaying;
  }, [isAutoPlaying]);

  const fetchJuzData = async (juzNumber) => {
    setIsLoading(true);
    setError(null);
    try {
      const [arabicResponse, audioResponse] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/ar.alafasy`)
      ]);
      const arabicData = await arabicResponse.json();
      const audioDataResult = await audioResponse.json();
      setJuzData(arabicData.data);
      setAudioData(audioDataResult.data);
    } catch (err) {
      setError('Failed to load juz. Please try again later.');
      console.error('Error fetching juz:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJuz) {
      fetchJuzData(selectedJuz);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [selectedJuz]);

  const pagesInJuz = useMemo(() => {
    if (!juzData?.ayahs) return [];
    const map = new Map();
    for (const ay of juzData.ayahs) {
      const p = ay.page;
      if (!map.has(p)) map.set(p, []);
      map.get(p).push(ay);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([page, ayahs]) => ({ page, ayahs }));
  }, [juzData]);

  const currentJuzPage = pagesInJuz[juzPageIndex] || null;

  const handlePageChange = (direction) => {
    stopAutoPlay();
    setFlipDirection(direction);
    if (direction === 'next') {
      setJuzPageIndex(Math.min(pagesInJuz.length - 1, juzPageIndex + 1));
    } else {
      setJuzPageIndex(Math.max(0, juzPageIndex - 1));
    }
  };

  const playAudio = (audioUrl, ayahNumber) => {
    if (playingAyah === ayahNumber && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlayingAyah(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(audioUrl);
    audioRef.current = newAudio;
    newAudio.play();
    setPlayingAyah(ayahNumber);

    newAudio.onended = () => {
      setPlayingAyah(null);

      if (isAutoPlayingRef.current && audioData) {
        const currentPageAyahs = currentJuzPage?.ayahs || [];
        const currentIndex = currentPageAyahs.findIndex(a => a.number === ayahNumber);
        const nextAyah = currentPageAyahs[currentIndex + 1];
        
        if (nextAyah) {
          const audioAyah = audioData.ayahs.find(a => a.number === nextAyah.number);
          if (audioAyah?.audio) {
            setTimeout(() => {
              playAudio(audioAyah.audio, nextAyah.number);
            }, 500);
          }
        } else {
          setIsAutoPlaying(false);
        }
      }
    };
  };

  const startAutoPlay = () => {
    if (!currentJuzPage?.ayahs || currentJuzPage.ayahs.length === 0 || !audioData) return;
    setIsAutoPlaying(true);
    const firstAyah = currentJuzPage.ayahs[0];
    const audioAyah = audioData.ayahs.find(a => a.number === firstAyah.number);
    if (audioAyah?.audio) {
      playAudio(audioAyah.audio, firstAyah.number);
    }
  };

  const stopAutoPlay = () => {
    setIsAutoPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingAyah(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 flex items-start gap-3 max-w-md">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">Error Loading Data</h3>
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes pageFlipNext {
          0% { transform: perspective(2000px) rotateY(0deg); opacity: 1; }
          50% { transform: perspective(2000px) rotateY(-90deg); opacity: 0.3; }
          100% { transform: perspective(2000px) rotateY(0deg); opacity: 1; }
        }
        
        @keyframes pageFlipPrev {
          0% { transform: perspective(2000px) rotateY(0deg); opacity: 1; }
          50% { transform: perspective(2000px) rotateY(90deg); opacity: 0.3; }
          100% { transform: perspective(2000px) rotateY(0deg); opacity: 1; }
        }
        
        .page-flip-next {
          animation: pageFlipNext 0.8s ease-in-out;
        }
        
        .page-flip-prev {
          animation: pageFlipPrev 0.8s ease-in-out;
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .dark .skeleton {
          background: linear-gradient(90deg, #334155 25%, #1e293b 50%, #334155 75%);
          background-size: 1000px 100%;
        }

        .ayah-playing {
          background: linear-gradient(90deg, transparent, hsl(var(--primary)/0.15), transparent);
          padding: 0 4px;
          border-radius: 4px;
        }
      `}</style>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground font-medium">Juz</label>
            <select
              value={selectedJuz ?? ''}
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : null;
                setSelectedJuz(v);
                setJuzPageIndex(0);
                stopAutoPlay();
              }}
              className="rounded-lg border-2 border-border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- select --</option>
              {Array.from({ length: 30 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="skeleton h-[900px] rounded-lg"></div>
        ) : selectedJuz ? (
          <>
            {/* Quran Page */}
            <div className={`${flipDirection === 'next' ? 'page-flip-next' : 'page-flip-prev'}`} key={juzPageIndex}>
              <div className="bg-card border border-border rounded-lg shadow-2xl min-h-[850px] relative p-8 md:p-12">
                {/* Surah Header - Only show for first ayah of new surah */}
                {currentJuzPage?.ayahs?.[0]?.numberInSurah === 1 && (
                  <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-quran text-foreground mb-6">
                      {currentJuzPage.ayahs[0].surah.name}
                    </h1>
                    
                    {/* Bismillah */}
                    {currentJuzPage.ayahs[0].surah.number !== 1 && currentJuzPage.ayahs[0].surah.number !== 9 && (
                      <p className="text-3xl md:text-4xl font-quran text-foreground mb-8 leading-loose">
                        بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
                      </p>
                    )}
                    
                    {/* Surah Info & Play Audio buttons */}
                    <div className="flex items-center justify-center gap-3 mt-10">
                      <button className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm">
                        <Info className="h-4 w-4" />
                        <span className="font-medium">Surah Info</span>
                      </button>
                      {!isAutoPlaying ? (
                        <button 
                          onClick={startAutoPlay}
                          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors text-sm"
                        >
                          <Play className="h-4 w-4" />
                          <span className="font-medium">Play Page</span>
                        </button>
                      ) : (
                        <button 
                          onClick={stopAutoPlay}
                          className="flex items-center gap-2 px-3 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg transition-colors text-sm"
                        >
                          <Square className="h-4 w-4" />
                          <span className="font-medium">Stop</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Ayahs Content */}
                <div className="space-y-2 relative z-10 text-center leading-loose" dir="rtl">
                  {(currentJuzPage?.ayahs ?? []).map((ayah, idx) => {
                    const isPlaying = playingAyah === ayah.number;
                    const audioAyah = audioData?.ayahs.find(a => a.number === ayah.number);
                    
                    return (
                      <span key={ayah.number} className="inline">
                        {/* Show surah title if not first ayah of page but first of surah */}
                        {idx !== 0 && ayah.numberInSurah === 1 && (
                          <span className="block my-12">
                            <span className="block text-4xl md:text-5xl font-quran text-foreground mb-6">
                              {ayah.surah.name}
                            </span>
                            {ayah.surah.number !== 1 && ayah.surah.number !== 9 && (
                              <span className="block text-3xl md:text-4xl font-quran text-foreground mb-8 leading-loose">
                                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
                              </span>
                            )}
                            <span className="flex items-center justify-center gap-3 mt-6 mb-8">
                              <button className="inline-flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm">
                                <Info className="h-4 w-4" />
                                <span className="font-medium">Surah Info</span>
                              </button>
                              {audioAyah?.audio && (
                                <button 
                                  onClick={() => playAudio(audioAyah.audio, ayah.number)}
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors text-sm"
                                >
                                  {isPlaying ? (
                                    <>
                                      <Pause className="h-4 w-4" />
                                      <span className="font-medium">Pause</span>
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-4 w-4" />
                                      <span className="font-medium">Play</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </span>
                          </span>
                        )}
                        
                        {/* Ayah text inline with highlighting */}
                        <span className={`text-3xl md:text-[2rem] font-quran text-foreground leading-[2.5] ${isPlaying ? 'ayah-playing' : ''}`}>
                          {ayah.numberInSurah === 1 && ayah.surah.number !== 1 && ayah.surah.number !== 9
                            ? ayah.text.split('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ')[1]
                            : ayah.text}
                        </span>
                        
                        {/* Verse number with audio button */}
                        <span className="inline-flex items-center gap-1 mx-2 align-middle">
                          {audioAyah?.audio && (
                            <button
                              onClick={() => playAudio(audioAyah.audio, ayah.number)}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-full hover:bg-primary/10 transition-colors"
                              title={isPlaying ? "Pause" : "Play ayah"}
                            >
                              {isPlaying ? (
                                <Pause className="h-3 w-3 text-primary" />
                              ) : (
                                <Play className="h-3 w-3 text-primary" />
                              )}
                            </button>
                          )}
                         <AyahSymbol number={ayah.numberInSurah} />
                        </span>
                        {' '}
                      </span>
                    );
                  })}
                </div>

                {/* Page Footer */}
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <div className="text-sm text-muted-foreground font-medium">
                    {currentJuzPage?.page}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={juzPageIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>
              
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">
                  Page {juzPageIndex + 1} of {pagesInJuz.length}
                </div>
              </div>
              
              <button
                onClick={() => handlePageChange('next')}
                disabled={juzPageIndex >= pagesInJuz.length - 1}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="p-12 bg-card border border-border rounded-lg shadow-xl text-center">
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Select a Juz to begin reading
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Pick a juz from the selector above to view its pages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageView;