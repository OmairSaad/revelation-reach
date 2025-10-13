import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quranApi } from '@/services/quranApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const PageView = () => {
  const { pageNumber } = useParams<{ pageNumber: string }>();
  const [selectedEdition, setSelectedEdition] = useState('en.asad');
  const currentPage = Number(pageNumber) || 1;

  const { data: pageData, isLoading, error } = useQuery({
    queryKey: ['page', currentPage, selectedEdition],
    queryFn: () => quranApi.getPageMultipleEditions(currentPage, ['quran-uthmani', selectedEdition]),
    enabled: !!currentPage,
  });

  const arabicPage = pageData?.[0];
  const translationPage = pageData?.[1];

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load page. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link to="/browse">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Browse
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <Link to={`/page/${Math.max(1, currentPage - 1)}`}>
                <Button variant="outline" size="icon" disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <span className="text-sm font-medium px-4">Page {currentPage} of 604</span>
              <Link to={`/page/${Math.min(604, currentPage + 1)}`}>
                <Button variant="outline" size="icon" disabled={currentPage === 604}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <>
              <Skeleton className="h-32 rounded-xl" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </>
          ) : arabicPage ? (
            <>
              {/* Page Header */}
              <Card className="p-6 bg-gradient-to-br from-primary via-primary-glow to-accent text-primary-foreground shadow-xl animate-fade-in">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Page {arabicPage.number}
                  </h1>
                  <p className="text-sm opacity-90">
                    {arabicPage.ayahs.length} Verses
                  </p>
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

              {/* Ayahs */}
              <div className="space-y-4">
                {arabicPage.ayahs.map((ayah, index) => {
                  const translation = translationPage?.ayahs[index];
                  const showHizbQuarter = index === 0 || ayah.hizbQuarter !== arabicPage.ayahs[index - 1]?.hizbQuarter;
                  
                  return (
                    <Card
                      key={ayah.number}
                      className="p-6 space-y-4 hover:shadow-lg transition-shadow animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md">
                            {ayah.numberInSurah}
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          {/* Surah Info */}
                          <Link 
                            to={`/surah/${ayah.number}`}
                            className="text-xs text-primary hover:underline inline-block"
                          >
                            Surah {ayah.number}:{ayah.numberInSurah}
                          </Link>

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

export default PageView;
