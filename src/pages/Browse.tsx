import { useQuery } from '@tanstack/react-query';
import { quranApi } from '@/services/quranApi';
import SurahCard from '@/components/SurahCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Browse = () => {
  const { data: surahs, isLoading, error } = useQuery({
    queryKey: ['surahs'],
    queryFn: quranApi.getAllSurahs,
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load surahs. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Browse Surahs
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore all 114 chapters of the Holy Quran
            </p>
          </div>

          {/* Surahs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))
              : surahs?.map((surah, index) => (
                  <div
                    key={surah.number}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <SurahCard surah={surah} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
