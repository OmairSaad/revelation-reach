import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quranApi } from '@/services/quranApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, BookOpen, Volume2, Bookmark } from 'lucide-react';
import { useState, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pause, Play } from 'lucide-react';

const SurahDetail = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const [selectedEdition, setSelectedEdition] = useState('en.asad');
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: surahData, isLoading, error } = useQuery({
    queryKey: ['surah', surahNumber, selectedEdition],
    queryFn: () => quranApi.getSurahMultipleEditions(Number(surahNumber), ['quran-uthmani', selectedEdition, 'ar.alafasy']),
    enabled: !!surahNumber,
  });

  const arabicSurah = surahData?.[0];
  const translationSurah = surahData?.[1];
  const audioSurah = surahData?.[2];

  const toggleBookmark = (ayahNumber: number) => {
    setBookmarkedAyahs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ayahNumber)) {
        newSet.delete(ayahNumber);
      } else {
        newSet.add(ayahNumber);
      }
      return newSet;
    });
  };

  const playAudio = (audioUrl: string, ayahNumber: number) => {
    if (playingAyah === ayahNumber && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlayingAyah(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setPlayingAyah(ayahNumber);
      audioRef.current.onended = () => setPlayingAyah(null);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load surah. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Link to="/browse">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Button>
          </Link>

          {isLoading ? (
            <>
              <Skeleton className="h-48 rounded-xl" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </>
          ) : arabicSurah ? (
            <>
              {/* Surah Header */}
              <Card className="p-8 bg-gradient-to-br from-primary via-primary-glow to-accent text-primary-foreground shadow-xl animate-fade-in">
                <div className="text-center space-y-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-foreground font-bold text-2xl shadow-lg">
                    {arabicSurah.number}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold" dir="rtl">
                    {arabicSurah.name}
                  </h1>
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-semibold">
                      {arabicSurah.englishName}
                    </h2>
                    <p className="text-lg opacity-90">
                      {arabicSurah.englishNameTranslation}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Badge variant="secondary" className="text-sm">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {arabicSurah.numberOfAyahs} Verses
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      {arabicSurah.revelationType}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Translation Selector */}
              <Card className="p-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Translation:
                  </span>
                  <Select value={selectedEdition} onValueChange={setSelectedEdition}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en.asad">Muhammad Asad</SelectItem>
                      <SelectItem value="en.pickthall">Marmaduke Pickthall</SelectItem>
                      <SelectItem value="en.sahih">Sahih International</SelectItem>
                      <SelectItem value="en.yusufali">Yusuf Ali</SelectItem>
                      <SelectItem value="en.hilali">Hilali & Khan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Bismillah */}
              {arabicSurah.number !== 1 && arabicSurah.number !== 9 && (
                <Card className="p-6 text-center bg-gradient-to-r from-muted/50 to-card border-primary/20 animate-fade-in">
                  <p className="text-2xl md:text-3xl text-primary" dir="rtl">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    In the name of Allah, the Most Gracious, the Most Merciful
                  </p>
                </Card>
              )}

              {/* Ayahs */}
              <div className="space-y-4">
                {arabicSurah.ayahs.map((ayah, index) => {
                  const translation = translationSurah?.ayahs[index];
                  const audioAyah = audioSurah?.ayahs[index];
                  const isBookmarked = bookmarkedAyahs.has(ayah.numberInSurah);
                  const isPlaying = playingAyah === ayah.numberInSurah;
                  const showHizbQuarter = index === 0 || ayah.hizbQuarter !== arabicSurah.ayahs[index - 1]?.hizbQuarter;
                  
                  return (
                    <Card
                      key={ayah.number}
                      className="p-6 space-y-4 hover:shadow-lg transition-shadow animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md">
                            {ayah.numberInSurah}
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          {/* Arabic Text with Rub al Hizb */}
                          <div className="text-right" dir="rtl">
                            <p className="text-2xl md:text-3xl leading-loose text-foreground font-quran inline">
                              {ayah.text}
                            </p>
                            {showHizbQuarter && (
                              <span className="inline-flex items-center gap-1 mx-2 text-primary">
                                <span className="text-3xl">۞</span>
                                <span className="text-sm font-sans">{ayah.hizbQuarter}</span>
                              </span>
                            )}
                          </div>
                          
                          {/* Translation */}
                          {translation && (
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed border-t pt-4">
                              {translation.text}
                            </p>
                          )}
                        </div>

                        <div className="flex-shrink-0 flex flex-col gap-2">
                          <Button
                            variant={isBookmarked ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => toggleBookmark(ayah.numberInSurah)}
                          >
                            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                          </Button>
                          {audioAyah?.audio && (
                            <Button 
                              variant={isPlaying ? 'default' : 'outline'} 
                              size="icon"
                              onClick={() => playAudio(audioAyah.audio!, ayah.numberInSurah)}
                            >
                              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SurahDetail;
