import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { quranApi } from '@/services/quranApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', activeSearch],
    queryFn: () => quranApi.search(activeSearch),
    enabled: activeSearch.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActiveSearch(searchTerm.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Search the Quran
            </h1>
            <p className="text-lg text-muted-foreground">
              Find verses across all English translations
            </p>
          </div>

          {/* Search Form */}
          <Card className="p-6 animate-fade-in">
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                type="text"
                placeholder="Search for keywords (e.g., mercy, patience, guidance)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </form>
          </Card>

          {/* Results */}
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          )}

          {searchResults && searchResults.count > 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Search Results
                </h2>
                <Badge variant="secondary" className="text-sm">
                  {searchResults.count} verses found
                </Badge>
              </div>

              <div className="space-y-4">
                {searchResults.matches.map((ayah, index) => (
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
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Surah {Math.floor((ayah.number - 1) / 10) + 1}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Verse {ayah.numberInSurah}
                          </Badge>
                        </div>
                        
                        <p className="text-base leading-relaxed text-foreground">
                          {ayah.text}
                        </p>
                        
                        <Link to={`/surah/${Math.floor((ayah.number - 1) / 10) + 1}`}>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <BookOpen className="h-4 w-4" />
                            Read Full Surah
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {searchResults && searchResults.count === 0 && (
            <Card className="p-12 text-center animate-fade-in">
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  No results found
                </h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords
                </p>
              </div>
            </Card>
          )}

          {!activeSearch && (
            <Card className="p-12 text-center animate-fade-in">
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mx-auto flex items-center justify-center">
                  <Search className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Start Your Search
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter keywords to search through English translations of the Holy Quran
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
